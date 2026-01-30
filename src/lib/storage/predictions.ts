import { db } from "@/db";
import { predictions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { CouncilPrediction } from "@/types";

/**
 * Convert a database row to a CouncilPrediction object
 */
function rowToPrediction(
  row: typeof predictions.$inferSelect
): CouncilPrediction {
  return {
    id: row.id,
    marketId: row.marketId,
    timestamp: row.timestamp.toISOString(),
    memberPredictions: row.memberPredictions,
    aggregatedPredictions: row.aggregatedPredictions,
    metadata: row.metadata,
  };
}

/**
 * Save a prediction for a market
 */
export async function savePrediction(
  prediction: CouncilPrediction
): Promise<void> {
  await db.insert(predictions).values({
    id: prediction.id,
    marketId: prediction.marketId,
    timestamp: new Date(prediction.timestamp),
    memberPredictions: prediction.memberPredictions,
    aggregatedPredictions: prediction.aggregatedPredictions,
    metadata: prediction.metadata,
  });
}

/**
 * Get the latest prediction for a market
 */
export async function getLatestPrediction(
  marketId: string
): Promise<CouncilPrediction | null> {
  const rows = await db
    .select()
    .from(predictions)
    .where(eq(predictions.marketId, marketId))
    .orderBy(desc(predictions.timestamp))
    .limit(1);
  return rows[0] ? rowToPrediction(rows[0]) : null;
}

/**
 * Get all predictions for a market, sorted by timestamp descending
 */
export async function getPredictions(
  marketId: string
): Promise<CouncilPrediction[]> {
  const rows = await db
    .select()
    .from(predictions)
    .where(eq(predictions.marketId, marketId))
    .orderBy(desc(predictions.timestamp));
  return rows.map(rowToPrediction);
}
