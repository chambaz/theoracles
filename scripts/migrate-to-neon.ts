import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { db } from "../src/db";
import { markets, predictions } from "../src/db/schema";
import type { Market, CouncilPrediction } from "../src/types";

const DATA_DIR = path.join(process.cwd(), "data");

async function migrateMarkets(): Promise<number> {
  const marketsFile = path.join(DATA_DIR, "markets.json");
  const data = JSON.parse(await fs.readFile(marketsFile, "utf-8"));
  const marketList: Market[] = data.markets;

  for (const market of marketList) {
    await db.insert(markets).values({
      id: market.id,
      title: market.title,
      description: market.description,
      category: market.category,
      options: market.options,
      resolutionDate: market.resolutionDate
        ? new Date(market.resolutionDate)
        : null,
      source: market.source ?? null,
      status: market.status,
      createdAt: new Date(market.createdAt),
      updatedAt: new Date(market.updatedAt),
    });
  }

  return marketList.length;
}

async function migratePredictions(): Promise<number> {
  const predictionsDir = path.join(DATA_DIR, "predictions");
  let count = 0;

  try {
    const marketDirs = await fs.readdir(predictionsDir);

    for (const marketId of marketDirs) {
      const marketDir = path.join(predictionsDir, marketId);
      const stat = await fs.stat(marketDir);
      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(marketDir);
      const predictionFiles = files.filter(
        (f) => f.endsWith(".json") && f !== "latest.json"
      );

      for (const file of predictionFiles) {
        const filePath = path.join(marketDir, file);
        const prediction: CouncilPrediction = JSON.parse(
          await fs.readFile(filePath, "utf-8")
        );

        await db.insert(predictions).values({
          id: prediction.id,
          marketId: prediction.marketId,
          timestamp: new Date(prediction.timestamp),
          memberPredictions: prediction.memberPredictions,
          aggregatedPredictions: prediction.aggregatedPredictions,
          metadata: prediction.metadata,
        });
        count++;
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("  No predictions directory found, skipping.");
      return 0;
    }
    throw error;
  }

  return count;
}

async function main() {
  console.log("Migrating data to Neon...\n");

  console.log("1. Migrating markets...");
  const marketCount = await migrateMarkets();
  console.log(`   Inserted ${marketCount} markets.\n`);

  console.log("2. Migrating predictions...");
  const predictionCount = await migratePredictions();
  console.log(`   Inserted ${predictionCount} predictions.\n`);

  console.log("Migration complete!");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
