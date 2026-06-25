import { Router, Request, Response } from "express";
import crypto from "crypto";
import { isAuthenticated } from "./basicAuth";
import { requireAdminIp, logAdminActivity } from "./middleware/adminIpCheck";
import { db } from "./db";
import { coupons } from "../shared/schema";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

router.post("/admin/coupons/create", isAuthenticated, requireAdminIp, logAdminActivity, async (req: Request, res: Response) => {
  try {
    const { code, discount, darkMatter, maxUses, expiresInDays } = req.body;

    const couponCode = code || crypto.randomBytes(4).toString("hex").toUpperCase();
    const existing = await db.select().from(coupons).where(eq(coupons.code, couponCode)).limit(1);
    if (existing.length) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    const expiry = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000)
      : new Date(Date.now() + 365 * 86400000);

    const [coupon] = await db.insert(coupons).values({
      code: couponCode,
      discount: Math.min(100, Math.max(0, Number(discount) || 0)),
      darkMatter: Math.max(0, Number(darkMatter) || 0),
      maxUses: Math.max(1, Number(maxUses) || 1),
      usedCount: 0,
      expiresAt: expiry,
      active: true,
      createdAt: new Date(),
    }).returning();

    res.json({ success: true, coupon });
  } catch (err) {
    console.error("[Admin Coupons] Create error:", err);
    res.status(500).json({ error: "Failed to create coupon" });
  }
});

router.get("/admin/coupons", isAuthenticated, requireAdminIp, async (_req: Request, res: Response) => {
  try {
    const allCoupons = await db.select().from(coupons).orderBy(sql`${coupons.createdAt} DESC`);
    res.json({ coupons: allCoupons });
  } catch (err) {
    console.error("[Admin Coupons] List error:", err);
    res.status(500).json({ error: "Failed to list coupons" });
  }
});

router.post("/admin/coupons/:id/deactivate", isAuthenticated, requireAdminIp, async (req: Request, res: Response) => {
  try {
    const [coupon] = await db.update(coupons).set({ active: false }).where(eq(coupons.id, req.params.id)).returning();
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ error: "Failed to deactivate coupon" });
  }
});

export default router;
