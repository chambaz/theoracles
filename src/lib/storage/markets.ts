import fs from "fs/promises";
import path from "path";
import type { Market, MarketsData } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const MARKETS_FILE = path.join(DATA_DIR, "markets.json");

/**
 * Get all markets
 */
export async function getMarkets(): Promise<Market[]> {
  try {
    const data = await fs.readFile(MARKETS_FILE, "utf-8");
    const parsed: MarketsData = JSON.parse(data);
    return parsed.markets;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Get a market by ID
 */
export async function getMarket(id: string): Promise<Market | null> {
  const markets = await getMarkets();
  return markets.find((m) => m.id === id) || null;
}

/**
 * Get all active markets
 */
export async function getActiveMarkets(): Promise<Market[]> {
  const markets = await getMarkets();
  return markets.filter((m) => m.status === "active");
}

/**
 * Save markets to file
 */
export async function saveMarkets(markets: Market[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const data: MarketsData = { markets };
  await fs.writeFile(MARKETS_FILE, JSON.stringify(data, null, 2));
}
