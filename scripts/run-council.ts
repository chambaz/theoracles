import "dotenv/config";
import * as fs from "node:fs";
import { runCouncil } from "../src/lib/council";
import { getMarket, getActiveMarkets } from "../src/lib/storage/markets";
import { savePrediction } from "../src/lib/storage/predictions";

function setupLogging() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const logFile = `council-${timestamp}.log`;
  const stream = fs.createWriteStream(logFile, { flags: "a" });
  const origOut = process.stdout.write.bind(process.stdout);
  const origErr = process.stderr.write.bind(process.stderr);

  process.stdout.write = (chunk: string | Uint8Array, ...rest: unknown[]) => {
    stream.write(chunk);
    return origOut(chunk, ...rest as [BufferEncoding, () => void]);
  };

  process.stderr.write = (chunk: string | Uint8Array, ...rest: unknown[]) => {
    stream.write(chunk);
    return origErr(chunk, ...rest as [BufferEncoding, () => void]);
  };

  console.log(`Logging to ${logFile}\n`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log("  npm run council <market-id>");
    console.log("  npm run council -- --all");
    console.log("  npm run council -- --all --logs");
    console.log("");
    console.log("Options:");
    console.log("  --all   Run predictions for all active markets");
    console.log("  --logs  Save output to a timestamped log file");
    process.exit(1);
  }

  if (args.includes("--logs")) {
    setupLogging();
  }

  const runAll = args.includes("--all");

  if (runAll) {
    const markets = await getActiveMarkets();
    if (markets.length === 0) {
      console.log("No active markets found.");
      process.exit(0);
    }

    console.log(`Found ${markets.length} active markets\n`);

    for (const market of markets) {
      try {
        await runForMarket(market.id);
      } catch (error) {
        console.error(`Failed to run council for ${market.id}:`, error);
      }
      console.log("\n" + "=".repeat(60) + "\n");
    }
  } else {
    const marketId = args[0];
    await runForMarket(marketId);
  }
}

async function runForMarket(marketId: string) {
  const market = await getMarket(marketId);

  if (!market) {
    console.error(`Market not found: ${marketId}`);
    process.exit(1);
  }

  console.log("=".repeat(60));
  console.log(`Market: ${market.title}`);
  console.log("=".repeat(60));

  const prediction = await runCouncil(market);

  // Save the prediction
  await savePrediction(prediction);
  console.log(`\nPrediction saved to database for market: ${market.id}`);

  // Display results
  console.log("\n" + "-".repeat(40));
  console.log("COUNCIL PREDICTION");
  console.log("-".repeat(40));

  // Sort by probability descending
  const sorted = Object.entries(prediction.aggregatedPredictions).sort(
    ([, a], [, b]) => b - a
  );

  for (const [optionId, probability] of sorted) {
    const option = market.options.find((o) => o.id === optionId);
    const name = option?.name || optionId;
    const pct = (probability * 100).toFixed(1);
    const bar = "█".repeat(Math.round(probability * 30));
    console.log(`${name.padEnd(20)} ${pct.padStart(5)}% ${bar}`);
  }

  console.log("\n" + "-".repeat(40));
  console.log("INDIVIDUAL PREDICTIONS");
  console.log("-".repeat(40));

  for (const memberPred of prediction.memberPredictions) {
    console.log(`\n[${memberPred.modelName}]`);
    console.log(`Confidence: ${(memberPred.confidence * 100).toFixed(0)}%`);
    console.log(`Duration: ${memberPred.durationMs}ms`);
    console.log(`Searches: ${memberPred.searchQueries.length}`);
    
    const memberSorted = Object.entries(memberPred.predictions).sort(
      ([, a], [, b]) => b - a
    );
    for (const [optionId, probability] of memberSorted.slice(0, 3)) {
      const option = market.options.find((o) => o.id === optionId);
      const name = option?.name || optionId;
      console.log(`  ${name}: ${(probability * 100).toFixed(1)}%`);
    }
  }

  if (prediction.metadata.failedMembers.length > 0) {
    console.log(`\nFailed members: ${prediction.metadata.failedMembers.join(", ")}`);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
