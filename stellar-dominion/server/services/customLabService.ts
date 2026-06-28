/**
 * Custom Lab Creation Service
 * Persistent implementation.
 */

import {
  CustomLab,
  calculateLabBonuses,
  calculateLabUpkeep,
  CUSTOM_LAB_CONFIG,
} from "../../shared/config/customLabConfig";
import { db } from "../db";
import { sql } from "drizzle-orm";

function toLab(row: any): CustomLab {
  return {
    id: String(row.id),
    name: String(row.name),
    size: String(row.size || "SMALL") as CustomLab["size"],
    specialization: String(row.specialization || "BALANCED") as CustomLab["specialization"],
    theme: String(row.theme || "FUTURISTIC") as CustomLab["theme"],
    modules: (row.modules as any[]) || [],
    staff: (row.staff as any[]) || [],
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    lastUpgradedAt: Number(row.last_upgraded_at || Date.now()),
    resourcesInvested: Number(row.resources_invested || 0),
    researchCompleted: Number(row.research_completed || 0),
    activeResearch: row.active_research ? String(row.active_research) : undefined,
    customization: (row.customization as any) || {
      color: "#00FF00",
      name: String(row.name),
      description: "",
    },
  };
}

export class CustomLabService {
  private static tableReady = false;

  private static async ensureTable() {
    if (this.tableReady) return;

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS custom_labs (
        id varchar PRIMARY KEY,
        user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name varchar NOT NULL,
        size varchar NOT NULL DEFAULT 'SMALL',
        specialization varchar NOT NULL DEFAULT 'BALANCED',
        theme varchar NOT NULL DEFAULT 'FUTURISTIC',
        modules jsonb NOT NULL DEFAULT '[]'::jsonb,
        staff jsonb NOT NULL DEFAULT '[]'::jsonb,
        customization jsonb NOT NULL DEFAULT '{}'::jsonb,
        active_research varchar,
        resources_invested integer NOT NULL DEFAULT 0,
        research_completed integer NOT NULL DEFAULT 0,
        last_upgraded_at bigint NOT NULL DEFAULT 0,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `);

    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS size varchar NOT NULL DEFAULT 'SMALL'`);
    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS theme varchar NOT NULL DEFAULT 'FUTURISTIC'`);
    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS modules jsonb NOT NULL DEFAULT '[]'::jsonb`);
    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS staff jsonb NOT NULL DEFAULT '[]'::jsonb`);
    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS customization jsonb NOT NULL DEFAULT '{}'::jsonb`);
    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS active_research varchar`);
    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS resources_invested integer NOT NULL DEFAULT 0`);
    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS research_completed integer NOT NULL DEFAULT 0`);
    await db.execute(sql`ALTER TABLE custom_labs ADD COLUMN IF NOT EXISTS last_upgraded_at bigint NOT NULL DEFAULT 0`);

    this.tableReady = true;
  }

  static async createLab(userId: string, name: string, specialization: any, theme: any): Promise<CustomLab> {
    await this.ensureTable();

    const id = `lab_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const now = Date.now();
    const safeSpecialization = (specialization in CUSTOM_LAB_CONFIG.SPECIALIZATIONS ? specialization : "BALANCED") as any;
    const safeTheme = (theme in CUSTOM_LAB_CONFIG.THEMES ? theme : "FUTURISTIC") as any;

    await db.execute(sql`
      INSERT INTO custom_labs (
        id, user_id, name, size, specialization, theme, modules, staff, customization,
        resources_invested, research_completed, last_upgraded_at
      ) VALUES (
        ${id}, ${userId}, ${name}, 'SMALL', ${safeSpecialization}, ${safeTheme},
        ${[]}, ${[]},
        ${{ color: "#00FF00", name, description: "" }},
        0, 0, ${now}
      )
    `);

    const created = await this.getLabById(userId, id);
    if (!created) throw new Error("Failed to create lab");
    return created;
  }

  static async getPlayerLabs(userId: string): Promise<CustomLab[]> {
    await this.ensureTable();

    const rows = await db.execute(sql`
      SELECT * FROM custom_labs WHERE user_id = ${userId} ORDER BY created_at DESC
    `);

    return rows.rows.map(toLab);
  }

  static async getLabById(userId: string, labId: string): Promise<CustomLab | null> {
    await this.ensureTable();

    const rows = await db.execute(sql`
      SELECT * FROM custom_labs WHERE user_id = ${userId} AND id = ${labId} LIMIT 1
    `);

    if (!rows.rows.length) return null;
    return toLab(rows.rows[0]);
  }

  static async upgradeLab(userId: string, labId: string, newSize: any): Promise<boolean> {
    const lab = await this.getLabById(userId, labId);
    if (!lab) return false;
    if (!(newSize in CUSTOM_LAB_CONFIG.LAB_SIZES)) return false;

    const now = Date.now();
    await db.execute(sql`
      UPDATE custom_labs
      SET size = ${String(newSize)},
          resources_invested = resources_invested + ${Number(CUSTOM_LAB_CONFIG.LAB_SIZES[newSize as keyof typeof CUSTOM_LAB_CONFIG.LAB_SIZES].upgradeCost)},
          last_upgraded_at = ${now},
          updated_at = now()
      WHERE id = ${labId} AND user_id = ${userId}
    `);

    return true;
  }

  static async addModule(userId: string, labId: string, moduleType: any): Promise<boolean> {
    const lab = await this.getLabById(userId, labId);
    if (!lab) return false;
    if (!(moduleType in CUSTOM_LAB_CONFIG.MODULES)) return false;

    const modules = [...(lab.modules || [])];
    const existing = modules.find((mod) => mod.type === moduleType);
    if (existing) {
      existing.level += 1;
    } else {
      modules.push({ type: moduleType, level: 1 });
    }

    await db.execute(sql`
      UPDATE custom_labs
      SET modules = ${modules}, updated_at = now()
      WHERE id = ${labId} AND user_id = ${userId}
    `);

    return true;
  }

  static async hireStaff(userId: string, labId: string, position: any, staffName: string): Promise<boolean> {
    const lab = await this.getLabById(userId, labId);
    if (!lab) return false;
    if (!(position in CUSTOM_LAB_CONFIG.STAFF_POSITIONS)) return false;

    const staff = [...(lab.staff || [])];
    staff.push({
      name: staffName,
      position,
      hiredAt: Date.now(),
      experience: 0,
      morale: 100,
    });

    await db.execute(sql`
      UPDATE custom_labs
      SET staff = ${staff}, updated_at = now()
      WHERE id = ${labId} AND user_id = ${userId}
    `);

    return true;
  }

  static async getLabBonuses(userId: string, labId: string) {
    const lab = await this.getLabById(userId, labId);
    if (!lab) return { speedBonus: 0, discoveryBonus: 0, costReduction: 0, capacityBonus: 0 };
    return calculateLabBonuses(lab);
  }

  static async getLabUpkeep(userId: string, labId: string): Promise<number> {
    const lab = await this.getLabById(userId, labId);
    if (!lab) return 0;
    return calculateLabUpkeep(lab);
  }

  static async updateCustomization(userId: string, labId: string, customization: any): Promise<boolean> {
    const lab = await this.getLabById(userId, labId);
    if (!lab) return false;

    const mergedCustomization = {
      ...lab.customization,
      ...customization,
    };

    await db.execute(sql`
      UPDATE custom_labs
      SET customization = ${mergedCustomization},
          name = ${String(mergedCustomization.name || lab.name)},
          updated_at = now()
      WHERE id = ${labId} AND user_id = ${userId}
    `);

    return true;
  }

  static async setActiveResearch(userId: string, labId: string, techId: string): Promise<boolean> {
    const lab = await this.getLabById(userId, labId);
    if (!lab) return false;

    await db.execute(sql`
      UPDATE custom_labs
      SET active_research = ${techId}, updated_at = now()
      WHERE id = ${labId} AND user_id = ${userId}
    `);

    return true;
  }

  static async trainStaff(userId: string, labId: string, staffName: string): Promise<boolean> {
    const lab = await this.getLabById(userId, labId);
    if (!lab) return false;

    const staff = [...(lab.staff || [])];
    const member = staff.find((s) => s.name === staffName);
    if (!member) return false;

    member.experience = Number(member.experience || 0) + 1;
    member.morale = Math.min(100, Number(member.morale || 100) + 2);

    await db.execute(sql`
      UPDATE custom_labs
      SET staff = ${staff}, updated_at = now()
      WHERE id = ${labId} AND user_id = ${userId}
    `);

    return true;
  }

  static async getLabsWithBonuses(userId: string) {
    const labs = await this.getPlayerLabs(userId);
    return labs.map((lab) => ({
      ...lab,
      bonuses: calculateLabBonuses(lab),
      upkeep: calculateLabUpkeep(lab),
    }));
  }

  static async deleteLab(userId: string, labId: string): Promise<boolean> {
    await this.ensureTable();

    const existing = await this.getLabById(userId, labId);
    if (!existing) return false;

    await db.execute(sql`
      DELETE FROM custom_labs WHERE id = ${labId} AND user_id = ${userId}
    `);

    return true;
  }
}
