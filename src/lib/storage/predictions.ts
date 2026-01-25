import fs from "fs/promises";
import path from "path";
import type { CouncilPrediction } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PREDICTIONS_DIR = path.join(DATA_DIR, "predictions");

/**
 * Get the predictions directory for a market
 */
function getMarketPredictionsDir(marketId: string): string {
  return path.join(PREDICTIONS_DIR, marketId);
}

/**
 * Save a prediction for a market
 */
export async function savePrediction(
  prediction: CouncilPrediction
): Promise<void> {
  const dir = getMarketPredictionsDir(prediction.marketId);
  await fs.mkdir(dir, { recursive: true });

  // Save with timestamp filename
  const filename = `${prediction.timestamp.replace(/[:.]/g, "-")}.json`;
  const filepath = path.join(dir, filename);
  await fs.writeFile(filepath, JSON.stringify(prediction, null, 2));

  // Also save as latest.json for easy access
  const latestPath = path.join(dir, "latest.json");
  await fs.writeFile(latestPath, JSON.stringify(prediction, null, 2));
}

/**
 * Get the latest prediction for a market
 */
export async function getLatestPrediction(
  marketId: string
): Promise<CouncilPrediction | null> {
  const latestPath = path.join(getMarketPredictionsDir(marketId), "latest.json");

  try {
    const data = await fs.readFile(latestPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get all predictions for a market, sorted by timestamp descending
 */
export async function getPredictions(
  marketId: string
): Promise<CouncilPrediction[]> {
  const dir = getMarketPredictionsDir(marketId);

  try {
    const files = await fs.readdir(dir);
    const predictionFiles = files.filter(
      (f) => f.endsWith(".json") && f !== "latest.json"
    );

    const predictions: CouncilPrediction[] = [];
    for (const file of predictionFiles) {
      const data = await fs.readFile(path.join(dir, file), "utf-8");
      predictions.push(JSON.parse(data));
    }

    // Sort by timestamp descending (newest first)
    return predictions.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}
