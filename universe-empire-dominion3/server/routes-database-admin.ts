import type { Express, Request, Response } from "express";
import { db, pool } from "./db";
import { isAuthenticated } from "./basicAuth";
import { hasAdminPermission } from "./adminPermissions";
import { adminUsers } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Database Admin Routes
 * Provides phpMyAdmin-like functionality for PostgreSQL
 * Accessible only to admins with "manage" or "administrate" permissions
 */

// ── Local copies of admin helper functions (mirrored from routes-admin.ts) ──

function getUserId(req: Request): string {
  return req.session?.userId || "";
}

function getImpersonatorId(req: Request): string {
  return req.session?.impersonatorId || "";
}

async function isAdminUser(userId: string): Promise<boolean> {
  if (!userId) return false;
  const [adminRecord] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);
  return Boolean(adminRecord);
}

async function getAdminAccess(userId: string): Promise<{
  isAdmin: boolean;
  role: string | null;
  permissions: string[];
}> {
  if (!userId) {
    return { isAdmin: false, role: null, permissions: [] };
  }
  const [adminRecord] = await db
    .select({ role: adminUsers.role, permissions: adminUsers.permissions })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);
  return {
    isAdmin: Boolean(adminRecord),
    role: adminRecord?.role || null,
    permissions: Array.isArray(adminRecord?.permissions)
      ? adminRecord.permissions.filter((value): value is string => typeof value === "string")
      : [],
  };
}

async function getAdminActorId(req: Request): Promise<string | null> {
  const currentUserId = getUserId(req);
  if (await isAdminUser(currentUserId)) {
    return currentUserId;
  }
  const impersonatorId = getImpersonatorId(req);
  if (await isAdminUser(impersonatorId)) {
    return impersonatorId;
  }
  return null;
}

async function requireAdminPermission(
  req: Request,
  res: Response,
): Promise<{ actorId: string; role: string | null; permissions: string[] } | null> {
  const actorId = await getAdminActorId(req);
  if (!actorId) {
    res.status(403).json({ message: "Admin access required" });
    return null;
  }

  const access = await getAdminAccess(actorId);
  if (!hasAdminPermission(access.permissions, "view_only") && !hasAdminPermission(access.permissions, "all_access")) {
    res.status(403).json({ message: "Admin view access required" });
    return null;
  }

  return { actorId, role: access.role, permissions: access.permissions };
}

async function requireAdminWritePermission(
  req: Request,
  res: Response,
): Promise<{ actorId: string; role: string | null; permissions: string[] } | null> {
  const actorId = await getAdminActorId(req);
  if (!actorId) {
    res.status(403).json({ message: "Admin access required" });
    return null;
  }

  const access = await getAdminAccess(actorId);
  if (!hasAdminPermission(access.permissions, "manage") && !hasAdminPermission(access.permissions, "all_access")) {
    res.status(403).json({ message: "Admin write/manage access required" });
    return null;
  }

  return { actorId, role: access.role, permissions: access.permissions };
}

export function registerDatabaseAdminRoutes(app: Express) {
  // ──────────────────────────────────────────────
  // Get all tables in the database
  // ──────────────────────────────────────────────
  app.get("/api/admin/db/tables", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res);
      if (!access) return;

      const result = await pool.query(`
        SELECT
          t.table_schema,
          t.table_name,
          t.table_type,
          (SELECT COUNT(*) FROM information_schema.columns c
           WHERE c.table_schema = t.table_schema AND c.table_name = t.table_name) as column_count,
          (SELECT reltuples::bigint FROM pg_class WHERE oid = (quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass::oid) as estimated_rows,
          pg_size_pretty(pg_total_relation_size(quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))) as total_size
        FROM information_schema.tables t
        WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY t.table_schema, t.table_name
      `);

      res.json({ tables: result.rows });
    } catch (error) {
      console.error("Failed to list database tables:", error);
      res.status(500).json({ message: "Failed to list database tables", error: (error as Error).message });
    }
  });

  // ──────────────────────────────────────────────
  // Get column info for a specific table
  // ──────────────────────────────────────────────
  app.get("/api/admin/db/table/:schema/:table/columns", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res);
      if (!access) return;

      const { schema, table } = req.params;

      const columns = await pool.query(`
        SELECT
          c.column_name,
          c.data_type,
          c.character_maximum_length,
          c.is_nullable,
          c.column_default,
          c.ordinal_position,
          tc.constraint_type,
          ccu.table_name AS referenced_table,
          ccu.column_name AS referenced_column,
          pgd.description
        FROM information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu
          ON c.table_schema = kcu.table_schema
          AND c.table_name = kcu.table_name
          AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.table_constraints tc
          ON kcu.constraint_name = tc.constraint_name
          AND kcu.table_schema = tc.table_schema
        LEFT JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
          AND tc.table_schema = ccu.table_schema
        LEFT JOIN pg_catalog.pg_statio_all_tables pst
          ON c.table_schema = pst.schemaname AND c.table_name = pst.relname
        LEFT JOIN pg_catalog.pg_description pgd
          ON pst.relid = pgd.objoid
          AND c.ordinal_position = pgd.objsubid
        WHERE c.table_schema = $1 AND c.table_name = $2
        ORDER BY c.ordinal_position
      `, [schema, table]);

      const indexes = await pool.query(`
        SELECT
          i.index_name,
          i.index_type,
          i.index_definition,
          i.table_name
        FROM (
          SELECT
            schemaname,
            tablename,
            indexname AS index_name,
            indexdef AS index_definition,
            CASE
              WHEN indexdef LIKE '%UNIQUE%' THEN 'UNIQUE'
              ELSE 'NON-UNIQUE'
            END AS index_type,
            tablename AS table_name
          FROM pg_indexes
          WHERE schemaname = $1 AND tablename = $2
        ) i
        ORDER BY i.index_name
      `, [schema, table]);

      res.json({
        schema,
        table,
        columns: columns.rows,
        indexes: indexes.rows
      });
    } catch (error) {
      console.error("Failed to get table columns:", error);
      res.status(500).json({ message: "Failed to get table columns", error: (error as Error).message });
    }
  });

  // ──────────────────────────────────────────────
  // Browse table data with pagination
  // ──────────────────────────────────────────────
  app.get("/api/admin/db/table/:schema/:table/data", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res);
      if (!access) return;

      const { schema, table } = req.params;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.min(100, Math.max(10, parseInt(req.query.pageSize as string) || 50));
      const offset = (page - 1) * pageSize;
      const orderBy = req.query.orderBy as string || null;
      const orderDir = (req.query.orderDir as string || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      const search = req.query.search as string || null;

      // Escape identifiers safely
      const safeSchema = schema.replace(/[^a-zA-Z0-9_]/g, '');
      const safeTable = table.replace(/[^a-zA-Z0-9_]/g, '');

      let whereClause = '';
      const params: any[] = [];
      let paramIndex = 0;

      if (search) {
        // Get columns to search against (text/varchar columns)
        const textCols = await pool.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = $1 AND table_name = $2
          AND data_type IN ('text', 'varchar', 'character varying', 'char', 'character', 'citext')
          ORDER BY ordinal_position LIMIT 10
        `, [safeSchema, safeTable]);

        if (textCols.rows.length > 0) {
          const conditions = textCols.rows.map((col: any) => {
            paramIndex++;
            params.push(`%${search}%`);
            return `"${col.column_name}"::text ILIKE $${paramIndex}`;
          });
          whereClause = 'WHERE ' + conditions.join(' OR ');
        }
      }

      // Count total rows
      const countResult = await pool.query(
        `SELECT COUNT(*) as total FROM "${safeSchema}"."${safeTable}" ${whereClause}`,
        params
      );
      const totalRows = parseInt(countResult.rows[0].total);

      // Get rows
      let orderClause = '';
      if (orderBy) {
        const safeOrderBy = orderBy.replace(/[^a-zA-Z0-9_]/g, '');
        orderClause = `ORDER BY "${safeOrderBy}" ${orderDir}`;
      } else {
        // Try to order by first column or id
        const firstCol = await pool.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = $1 AND table_name = $2
          ORDER BY ordinal_position LIMIT 1
        `, [safeSchema, safeTable]);
        if (firstCol.rows.length > 0) {
          orderClause = `ORDER BY "${firstCol.rows[0].column_name}" ASC`;
        }
      }

      paramIndex++;
      params.push(pageSize);
      paramIndex++;
      params.push(offset);

      const dataResult = await pool.query(
        `SELECT * FROM "${safeSchema}"."${safeTable}" ${whereClause} ${orderClause} LIMIT $${paramIndex - 1} OFFSET $${paramIndex}`,
        params
      );

      res.json({
        schema,
        table,
        data: dataResult.rows,
        pagination: {
          page,
          pageSize,
          totalRows,
          totalPages: Math.ceil(totalRows / pageSize),
          hasNext: offset + pageSize < totalRows,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error("Failed to browse table data:", error);
      res.status(500).json({ message: "Failed to browse table data", error: (error as Error).message });
    }
  });

  // ──────────────────────────────────────────────
  // Get table row count
  // ──────────────────────────────────────────────
  app.get("/api/admin/db/table/:schema/:table/count", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res);
      if (!access) return;

      const { schema, table } = req.params;
      const safeSchema = schema.replace(/[^a-zA-Z0-9_]/g, '');
      const safeTable = table.replace(/[^a-zA-Z0-9_]/g, '');

      const result = await pool.query(
        `SELECT COUNT(*) as count FROM "${safeSchema}"."${safeTable}"`
      );
      res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
      console.error("Failed to count table rows:", error);
      res.status(500).json({ message: "Failed to count table rows" });
    }
  });

  // ──────────────────────────────────────────────
  // Execute raw SQL query
  // ──────────────────────────────────────────────
  app.post("/api/admin/db/query", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminWritePermission(req, res);
      if (!access) return;

      const { sql: queryText, params: queryParams = [] } = req.body;

      if (!queryText || typeof queryText !== 'string') {
        return res.status(400).json({ message: "SQL query is required" });
      }

      const trimmedQuery = queryText.trim().toUpperCase();

      // For safety, restrict non-SELECT queries unless confirmed
      const isReadOnly = trimmedQuery.startsWith('SELECT') ||
                         trimmedQuery.startsWith('WITH') ||
                         trimmedQuery.startsWith('EXPLAIN') ||
                         trimmedQuery.startsWith('SHOW') ||
                         trimmedQuery.startsWith('DESCRIBE');

      if (!isReadOnly) {
        const confirmParam = req.query.confirm as string;
        if (confirmParam !== 'true') {
          return res.status(403).json({
            message: "Write operations require confirmation",
            requiresConfirm: true,
            queryType: trimmedQuery.split(' ')[0]
          });
        }
      }

      const startTime = Date.now();
      const result = await pool.query(queryText, queryParams);
      const duration = Date.now() - startTime;

      res.json({
        success: true,
        rows: result.rows || [],
        rowCount: result.rowCount ?? 0,
        fields: result.fields?.map(f => ({ name: f.name, dataTypeID: f.dataTypeID })) || [],
        duration,
        command: result.command,
      });
    } catch (error) {
      console.error("SQL query execution failed:", error);
      res.status(500).json({
        message: "SQL query execution failed",
        error: (error as Error).message,
        success: false
      });
    }
  });

  // ──────────────────────────────────────────────
  // Get database overview / status
  // ──────────────────────────────────────────────
  app.get("/api/admin/db/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res);
      if (!access) return;

      const version = await pool.query('SELECT version()');
      const serverInfo = await pool.query(`
        SELECT
          current_database() as database,
          current_schema as schema,
          pg_size_pretty(pg_database_size(current_database())) as database_size,
          (SELECT COUNT(*) FROM pg_stat_activity WHERE datname = current_database()) as active_connections,
          (SELECT setting FROM pg_settings WHERE name = 'max_connections') as max_connections,
          (SELECT setting FROM pg_settings WHERE name = 'server_version') as server_version
      `);

      const schemas = await pool.query(`
        SELECT
          schema_name
        FROM information_schema.schemata
        WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
        ORDER BY schema_name
      `);

      const recentQueries = await pool.query(`
        SELECT
          datname,
          query,
          state,
          wait_event_type,
          wait_event,
          query_start,
          state_change,
          pid
        FROM pg_stat_activity
        WHERE datname = current_database()
          AND state != 'idle'
          AND pid != pg_backend_pid()
        ORDER BY query_start DESC
        LIMIT 20
      `);

      res.json({
        version: version.rows[0]?.version || '',
        serverInfo: serverInfo.rows[0] || {},
        schemas: schemas.rows || [],
        activeQueries: recentQueries.rows || [],
        uptime: process.uptime(),
      });
    } catch (error) {
      console.error("Failed to get database status:", error);
      res.status(500).json({ message: "Failed to get database status" });
    }
  });

  // ──────────────────────────────────────────────
  // Update a row in a table
  // ──────────────────────────────────────────────
  app.patch("/api/admin/db/table/:schema/:table/row", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminWritePermission(req, res);
      if (!access) return;

      const { schema, table } = req.params;
      const { where, data } = req.body;

      if (!where || !data || typeof data !== 'object') {
        return res.status(400).json({ message: "where condition and data are required" });
      }

      const safeSchema = schema.replace(/[^a-zA-Z0-9_]/g, '');
      const safeTable = table.replace(/[^a-zA-Z0-9_]/g, '');

      const setClauses: string[] = [];
      const params: any[] = [];
      let paramIndex = 0;

      for (const [key, value] of Object.entries(data)) {
        paramIndex++;
        setClauses.push(`"${key.replace(/[^a-zA-Z0-9_]/g, '')}" = $${paramIndex}`);
        params.push(value);
      }

      const whereClauses: string[] = [];
      for (const [key, value] of Object.entries(where)) {
        paramIndex++;
        whereClauses.push(`"${key.replace(/[^a-zA-Z0-9_]/g, '')}" = $${paramIndex}`);
        params.push(value);
      }

      const result = await pool.query(
        `UPDATE "${safeSchema}"."${safeTable}" SET ${setClauses.join(', ')} WHERE ${whereClauses.join(' AND ')}`,
        params
      );

      res.json({ success: true, rowCount: result.rowCount });
    } catch (error) {
      console.error("Failed to update row:", error);
      res.status(500).json({ message: "Failed to update row", error: (error as Error).message });
    }
  });

  // ──────────────────────────────────────────────
  // Delete a row from a table
  // ──────────────────────────────────────────────
  app.delete("/api/admin/db/table/:schema/:table/row", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminWritePermission(req, res);
      if (!access) return;

      const { schema, table } = req.params;
      const { where } = req.body;

      if (!where || typeof where !== 'object') {
        return res.status(400).json({ message: "where condition is required" });
      }

      const safeSchema = schema.replace(/[^a-zA-Z0-9_]/g, '');
      const safeTable = table.replace(/[^a-zA-Z0-9_]/g, '');

      const whereClauses: string[] = [];
      const params: any[] = [];
      let paramIndex = 0;

      for (const [key, value] of Object.entries(where)) {
        paramIndex++;
        whereClauses.push(`"${key.replace(/[^a-zA-Z0-9_]/g, '')}" = $${paramIndex}`);
        params.push(value);
      }

      const result = await pool.query(
        `DELETE FROM "${safeSchema}"."${safeTable}" WHERE ${whereClauses.join(' AND ')}`,
        params
      );

      res.json({ success: true, rowCount: result.rowCount });
    } catch (error) {
      console.error("Failed to delete row:", error);
      res.status(500).json({ message: "Failed to delete row", error: (error as Error).message });
    }
  });

  // ──────────────────────────────────────────────
  // Insert a row into a table
  // ──────────────────────────────────────────────
  app.post("/api/admin/db/table/:schema/:table/row", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminWritePermission(req, res);
      if (!access) return;

      const { schema, table } = req.params;
      const { data } = req.body;

      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return res.status(400).json({ message: "data object with key-value pairs is required" });
      }

      const safeSchema = schema.replace(/[^a-zA-Z0-9_]/g, '');
      const safeTable = table.replace(/[^a-zA-Z0-9_]/g, '');

      const columns: string[] = [];
      const placeholders: string[] = [];
      const params: any[] = [];
      let paramIndex = 0;

      for (const [key, value] of Object.entries(data)) {
        paramIndex++;
        const safeCol = key.replace(/[^a-zA-Z0-9_]/g, '');
        columns.push(`"${safeCol}"`);
        placeholders.push(`$${paramIndex}`);
        params.push(value !== undefined ? value : null);
      }

      const result = await pool.query(
        `INSERT INTO "${safeSchema}"."${safeTable}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        params
      );

      res.json({ success: true, row: result.rows[0] || null, rowCount: result.rowCount });
    } catch (error) {
      console.error("Failed to insert row:", error);
      res.status(500).json({ message: "Failed to insert row", error: (error as Error).message });
    }
  });

  // ──────────────────────────────────────────────
  // Export table data as JSON
  // ──────────────────────────────────────────────
  app.get("/api/admin/db/table/:schema/:table/export", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminWritePermission(req, res);
      if (!access) return;

      const { schema, table } = req.params;
      const safeSchema = schema.replace(/[^a-zA-Z0-9_]/g, '');
      const safeTable = table.replace(/[^a-zA-Z0-9_]/g, '');

      const result = await pool.query(`SELECT * FROM "${safeSchema}"."${safeTable}"`);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTable}_export.json"`);
      res.json({
        exportedAt: new Date().toISOString(),
        schema: safeSchema,
        table: safeTable,
        rowCount: result.rowCount,
        data: result.rows
      });
    } catch (error) {
      console.error("Failed to export table:", error);
      res.status(500).json({ message: "Failed to export table", error: (error as Error).message });
    }
  });
}