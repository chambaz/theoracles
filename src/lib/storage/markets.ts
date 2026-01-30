import { db } from "@/db";
import { markets } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Market } from "@/types";

/**
 * Convert a database row to a Market object
 */
function rowToMarket(row: typeof markets.$inferSelect): Market {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    options: row.options,
    resolutionDate: row.resolutionDate?.toISOString(),
    source: row.source ?? undefined,
    status: row.status as Market["status"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/**
 * Get all markets
 */
export async function getMarkets(): Promise<Market[]> {
  const rows = await db.select().from(markets);
  return rows.map(rowToMarket);
}

/**
 * Get a market by ID
 */
export async function getMarket(id: string): Promise<Market | null> {
  const rows = await db.select().from(markets).where(eq(markets.id, id));
  return rows[0] ? rowToMarket(rows[0]) : null;
}

/**
 * Get all active markets
 */
export async function getActiveMarkets(): Promise<Market[]> {
  const rows = await db
    .select()
    .from(markets)
    .where(eq(markets.status, "active"));
  return rows.map(rowToMarket);
}
