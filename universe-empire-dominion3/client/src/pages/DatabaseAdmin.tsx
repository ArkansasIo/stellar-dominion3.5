import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Database,
  Table2,
  Columns3,
  Play,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Trash2,
  Edit,
  Copy,
  Terminal,
  Server,
  Activity,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ──────────────────────────────────────────

interface TableInfo {
  table_schema: string;
  table_name: string;
  table_type: string;
  column_count: number;
  estimated_rows: number;
  total_size: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  is_nullable: string;
  column_default: string | null;
  ordinal_position: number;
  constraint_type: string | null;
  referenced_table: string | null;
  referenced_column: string | null;
  description: string | null;
}

interface IndexInfo {
  index_name: string;
  index_type: string;
  index_definition: string;
}

interface ServerInfo {
  database: string;
  schema: string;
  database_size: string;
  active_connections: number;
  max_connections: string;
  server_version: string;
}

interface SchemaInfo {
  schema_name: string;
  schema_size: string;
}

interface ActiveQuery {
  datname: string;
  query: string;
  state: string;
  wait_event_type: string | null;
  wait_event: string | null;
  query_start: string;
  pid: number;
}

interface DbStatus {
  version: string;
  serverInfo: ServerInfo;
  schemas: SchemaInfo[];
  activeQueries: ActiveQuery[];
  uptime: number;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── API helpers ─────────────────────────────────────

const API_BASE = "/api/admin/db";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Main Component ──────────────────────────────────

export default function DatabaseAdmin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tables");

  // Data states
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [selectedTable, setSelectedTable] = useState<{ schema: string; table: string } | null>(null);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [indexes, setIndexes] = useState<IndexInfo[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // SQL query state
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM ");
  const [sqlResults, setSqlResults] = useState<any>(null);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [requireConfirm, setRequireConfirm] = useState(false);

  // ─── Load Data ────────────────────────────────────

  const loadTables = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ tables: TableInfo[] }>("/tables");
      setTables(data.tables);
    } catch (err: any) {
      toast({ title: "Failed to load tables", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadStatus = useCallback(async () => {
    try {
      const data = await apiFetch<DbStatus>("/status");
      setDbStatus(data);
    } catch (err: any) {
      console.error("Failed to load DB status:", err);
    }
  }, []);

  const loadTableColumns = useCallback(async (schema: string, table: string) => {
    try {
      const data = await apiFetch<{ columns: ColumnInfo[]; indexes: IndexInfo[] }>(
        `/table/${encodeURIComponent(schema)}/${encodeURIComponent(table)}/columns`
      );
      setColumns(data.columns);
      setIndexes(data.indexes);
    } catch (err: any) {
      toast({ title: "Failed to load columns", description: err.message, variant: "destructive" });
    }
  }, [toast]);

  const loadTableData = useCallback(async (schema: string, table: string, page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      let url = `/table/${encodeURIComponent(schema)}/${encodeURIComponent(table)}/data?page=${page}&pageSize=25`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const data = await apiFetch<{ data: any[]; pagination: Pagination }>(url);
      setTableData(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      toast({ title: "Failed to load table data", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const selectTable = (schema: string, table: string) => {
    setSelectedTable({ schema, table });
    loadTableColumns(schema, table);
    loadTableData(schema, table, 1, "");
    setSearch("");
  };

  const executeSql = useCallback(async () => {
    if (!sqlQuery.trim()) return;
    setSqlLoading(true);
    setRequireConfirm(false);
    try {
      const data = await apiFetch<any>(`/query?confirm=${requireConfirm ? "true" : "false"}`, {
        method: "POST",
        body: JSON.stringify({ sql: sqlQuery, params: [] }),
      });
      setSqlResults(data);
    } catch (err: any) {
      if (err.message?.includes("requiresConfirm") || err.message?.includes("confirmation")) {
        setRequireConfirm(true);
      }
      setSqlResults({ success: false, error: err.message });
    } finally {
      setSqlLoading(false);
    }
  }, [sqlQuery, requireConfirm]);

  // Initial load
  useEffect(() => {
    loadTables();
    loadStatus();
  }, [loadTables, loadStatus]);

  // ─── Render ────────────────────────────────────────

  const formatBytes = (size: string) => size || "0 bytes";

  return (
    <GameLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold">Database Administrator</h1>
            <Badge variant="outline" className="text-xs font-mono">
              PostgreSQL
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadTables}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="tables">
              <Table2 className="w-4 h-4 mr-1" /> Tables
            </TabsTrigger>
            <TabsTrigger value="browse">
              <Database className="w-4 h-4 mr-1" /> Browse Data
            </TabsTrigger>
            <TabsTrigger value="sql">
              <Terminal className="w-4 h-4 mr-1" /> SQL Query
            </TabsTrigger>
            <TabsTrigger value="status">
              <Server className="w-4 h-4 mr-1" /> Server Status
            </TabsTrigger>
          </TabsList>

          {/* ─── Tables Tab ──────────────────────────── */}
          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Table2 className="w-5 h-5 text-blue-400" />
                  Database Tables
                </CardTitle>
                <CardDescription>
                  {tables.length} tables found across all schemas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schema</TableHead>
                      <TableHead>Table Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Columns</TableHead>
                      <TableHead className="text-right">Est. Rows</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tables.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          {loading ? "Loading tables..." : "No tables found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      tables.map((t) => (
                        <TableRow
                          key={`${t.table_schema}.${t.table_name}`}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => { selectTable(t.table_schema, t.table_name); setActiveTab("browse"); }}
                        >
                          <TableCell>
                            <Badge variant="secondary" className="font-mono text-xs">
                              {t.table_schema}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono font-medium">{t.table_name}</TableCell>
                          <TableCell>
                            <Badge variant={t.table_type === "BASE TABLE" ? "default" : "outline"}>
                              {t.table_type === "BASE TABLE" ? "TABLE" : t.table_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{t.column_count}</TableCell>
                          <TableCell className="text-right font-mono">
                            {t.estimated_rows > 1000
                              ? `${(t.estimated_rows / 1000).toFixed(1)}K`
                              : t.estimated_rows}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {formatBytes(t.total_size)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7"
                                onClick={() => { selectTable(t.table_schema, t.table_name); setActiveTab("browse"); }}
                              >
                                <Search className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7"
                                onClick={async () => {
                                  try {
                                    await apiFetch(`/table/${t.table_schema}/${t.table_name}/export`, { method: "GET" });
                                    window.open(`${API_BASE}/table/${t.table_schema}/${t.table_name}/export`, "_blank");
                                  } catch (err: any) {
                                    toast({ title: "Export failed", description: err.message, variant: "destructive" });
                                  }
                                }}
                              >
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Browse Data Tab ─────────────────────── */}
          <TabsContent value="browse" className="space-y-4">
            {!selectedTable ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a table from the Tables tab to browse its data</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Table2 className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-lg font-mono">
                          {selectedTable.schema}.{selectedTable.table}
                        </CardTitle>
                        <Badge variant="outline" className="font-mono">
                          {columns.length} columns
                        </Badge>
                        {indexes.length > 0 && (
                          <Badge variant="outline" className="font-mono">
                            {indexes.length} indexes
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
                          <Input
                            placeholder="Search..."
                            className="pl-8 h-9 w-48 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                loadTableData(selectedTable.schema, selectedTable.table, 1, search);
                              }
                            }}
                          />
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => loadTableData(selectedTable.schema, selectedTable.table, 1, search)}
                        >
                          <Search className="w-4 h-4 mr-1" /> Search
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadTableData(selectedTable.schema, selectedTable.table, 1, "")}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Columns info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Columns3 className="w-4 h-4" /> Column Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-40">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Name</TableHead>
                            <TableHead className="text-xs">Type</TableHead>
                            <TableHead className="text-xs">Nullable</TableHead>
                            <TableHead className="text-xs">Default</TableHead>
                            <TableHead className="text-xs">Key</TableHead>
                            <TableHead className="text-xs">References</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {columns.map((col) => (
                            <TableRow key={col.column_name}>
                              <TableCell className="font-mono text-xs">{col.column_name}</TableCell>
                              <TableCell className="font-mono text-xs text-blue-400">
                                {col.data_type}
                                {col.character_maximum_length ? `(${col.character_maximum_length})` : ""}
                              </TableCell>
                              <TableCell className="text-xs">{col.is_nullable === "YES" ? "YES" : "NO"}</TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {col.column_default || "-"}
                              </TableCell>
                              <TableCell>
                                {col.constraint_type && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                                    {col.constraint_type}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {col.referenced_table ? `${col.referenced_table}.${col.referenced_column}` : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Table Data */}
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[500px]">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            {columns.slice(0, 20).map((col) => (
                              <TableHead key={col.column_name} className="font-mono text-xs whitespace-nowrap">
                                {col.column_name}
                              </TableHead>
                            ))}
                            {columns.length > 20 && (
                              <TableHead className="text-xs text-muted-foreground">
                                +{columns.length - 20} more
                              </TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={Math.min(columns.length + 1, 21)} className="text-center py-8">
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                              </TableCell>
                            </TableRow>
                          ) : tableData.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={Math.min(columns.length + 1, 21)} className="text-center py-8 text-muted-foreground">
                                No data found
                              </TableCell>
                            </TableRow>
                          ) : (
                            tableData.map((row, rowIdx) => (
                              <TableRow key={rowIdx}>
                                {columns.slice(0, 20).map((col) => {
                                  const val = row[col.column_name];
                                  const display = val === null
                                    ? <span className="text-muted-foreground italic">NULL</span>
                                    : typeof val === "object"
                                      ? JSON.stringify(val).slice(0, 100)
                                      : String(val);
                                  return (
                                    <TableCell key={col.column_name} className="font-mono text-xs max-w-[200px] truncate">
                                      {display}
                                    </TableCell>
                                  );
                                })}
                                {columns.length > 20 && (
                                  <TableCell className="text-xs text-muted-foreground">...</TableCell>
                                )}
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                  {pagination && (
                    <div className="flex items-center justify-between p-3 border-t">
                      <div className="text-xs text-muted-foreground">
                        Showing {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
                        {Math.min(pagination.page * pagination.pageSize, pagination.totalRows)} of{" "}
                        {pagination.totalRows} rows
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                          disabled={!pagination.hasPrev}
                          onClick={() =>
                            selectedTable &&
                            loadTableData(selectedTable.schema, selectedTable.table, pagination.page - 1, search)
                          }
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        <span className="text-xs font-mono mx-1">
                          {pagination.page} / {pagination.totalPages}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                          disabled={!pagination.hasNext}
                          onClick={() =>
                            selectedTable &&
                            loadTableData(selectedTable.schema, selectedTable.table, pagination.page + 1, search)
                          }
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )}
          </TabsContent>

          {/* ─── SQL Query Tab ───────────────────────── */}
          <TabsContent value="sql" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-green-400" />
                  SQL Query Executor
                </CardTitle>
                <CardDescription>
                  Execute raw SQL queries against the database. Write operations require confirmation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Enter SQL query..."
                  className="font-mono text-sm min-h-[120px]"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      onClick={executeSql}
                      disabled={sqlLoading || !sqlQuery.trim()}
                    >
                      {sqlLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <Play className="w-4 h-4 mr-1" />
                      )}
                      Execute
                    </Button>
                    {requireConfirm && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setRequireConfirm(true);
                          executeSql();
                        }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Confirm Write Operation
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSqlQuery("SELECT * FROM ")}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" /> Reset
                  </Button>
                </div>

                {/* Results */}
                {sqlResults && (
                  <div className="space-y-2 mt-4">
                    <Separator />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={sqlResults.success ? "secondary" : "destructive"}>
                        {sqlResults.command || "ERROR"}
                      </Badge>
                      {sqlResults.duration && (
                        <span>{sqlResults.duration}ms</span>
                      )}
                      {sqlResults.rowCount !== undefined && (
                        <span>{sqlResults.rowCount} rows affected</span>
                      )}
                      {sqlResults.rows?.length > 0 && (
                        <span>{sqlResults.rows.length} rows returned</span>
                      )}
                    </div>
                    {sqlResults.error && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3">
                        <p className="text-sm font-mono text-destructive">{sqlResults.error}</p>
                      </div>
                    )}
                    {sqlResults.rows && sqlResults.rows.length > 0 && (
                      <ScrollArea className="max-h-[400px] border rounded-md">
                        <Table>
                          <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                              {sqlResults.fields?.slice(0, 20).map((f: any) => (
                                <TableHead key={f.name} className="font-mono text-xs whitespace-nowrap">
                                  {f.name}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sqlResults.rows.map((row: any, idx: number) => (
                              <TableRow key={idx}>
                                {sqlResults.fields?.slice(0, 20).map((f: any) => (
                                  <TableCell key={f.name} className="font-mono text-xs max-w-[200px] truncate">
                                    {row[f.name] === null
                                      ? <span className="text-muted-foreground italic">NULL</span>
                                      : typeof row[f.name] === "object"
                                        ? JSON.stringify(row[f.name])
                                        : String(row[f.name])}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Server Status Tab ───────────────────── */}
          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" /> Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">{dbStatus?.serverInfo?.database || "-"}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dbStatus?.serverInfo?.server_version || "N/A"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" /> Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">
                    {dbStatus?.serverInfo?.database_size || "-"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current schema: {dbStatus?.serverInfo?.schema || "public"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-yellow-400" /> Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">
                    {dbStatus?.serverInfo?.active_connections ?? 0}
                    <span className="text-sm text-muted-foreground">
                      /{dbStatus?.serverInfo?.max_connections || "?"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active connections</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" /> Server Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">
                    {dbStatus ? `${Math.floor(dbStatus.uptime / 3600)}h` : "-"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">PostgreSQL Server</p>
                </CardContent>
              </Card>
            </div>

            {/* Schemas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schemas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schema Name</TableHead>
                      <TableHead>Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dbStatus?.schemas?.map((s) => (
                      <TableRow key={s.schema_name}>
                        <TableCell className="font-mono">{s.schema_name}</TableCell>
                        <TableCell className="font-mono text-xs">{s.schema_size || "0 bytes"}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">No schema data</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Active Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Queries</CardTitle>
                <CardDescription>
                  Currently running PostgreSQL queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">PID</TableHead>
                        <TableHead className="text-xs">State</TableHead>
                        <TableHead className="text-xs">Query</TableHead>
                        <TableHead className="text-xs">Started</TableHead>
                        <TableHead className="text-xs">Wait</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dbStatus?.activeQueries?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                            No active queries
                          </TableCell>
                        </TableRow>
                      ) : (
                        dbStatus?.activeQueries?.map((q, i) => (
                          <TableRow key={q.pid || i}>
                            <TableCell className="font-mono text-xs">{q.pid}</TableCell>
                            <TableCell>
                              <Badge variant={q.state === "active" ? "default" : "secondary"} className="text-xs">
                                {q.state}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs max-w-[300px] truncate">
                              {q.query}
                            </TableCell>
                            <TableCell className="text-xs">
                              {q.query_start ? new Date(q.query_start).toLocaleTimeString() : "-"}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {q.wait_event || "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}