import { nanoid } from "nanoid";
import { getEnabledMembers } from "@/config/council";
import type { Market, CouncilPrediction, ModelPrediction } from "@/types";
import { runCouncilMember } from "./member";
import { aggregatePredictions } from "./aggregation";

export { runCouncilMember } from "./member";
export { aggregatePredictions } from "./aggregation";

/**
 * Run the full council to generate predictions for a market
 * Runs all enabled council members in parallel
 */
export async function runCouncil(market: Market): Promise<CouncilPrediction> {
  const startTime = Date.now();
  const enabledMembers = getEnabledMembers();

  console.log(`\nRunning council for market: ${market.title}`);
  console.log(`Council members: ${enabledMembers.map((m) => m.name).join(", ")}`);

  // Run all council members in parallel
  const results = await Promise.allSettled(
    enabledMembers.map(async (member) => {
      console.log(`\n[${member.name}] Starting research and prediction...`);
      try {
        const prediction = await runCouncilMember(member, market);
        console.log(`[${member.name}] Completed in ${prediction.durationMs}ms`);
        console.log(`[${member.name}] Made ${prediction.searchQueries.length} searches`);
        return prediction;
      } catch (error) {
        console.error(`[${member.name}] Failed:`, error);
        throw error;
      }
    })
  );

  // Separate successful and failed predictions
  const memberPredictions: ModelPrediction[] = [];
  const failedMembers: string[] = [];

  results.forEach((result, index) => {
    const member = enabledMembers[index];
    if (result.status === "fulfilled") {
      memberPredictions.push(result.value);
    } else {
      failedMembers.push(member.name);
      console.error(`\n[${member.name}] Error:`, result.reason);
    }
  });

  if (memberPredictions.length === 0) {
    throw new Error("All council members failed to generate predictions");
  }

  // Aggregate predictions from successful members
  const aggregatedPredictions = aggregatePredictions(memberPredictions);

  const totalDurationMs = Date.now() - startTime;
  console.log(`\nCouncil completed in ${totalDurationMs}ms`);
  console.log(`Successful: ${memberPredictions.length}/${enabledMembers.length}`);

  return {
    id: nanoid(),
    marketId: market.id,
    timestamp: new Date().toISOString(),
    memberPredictions,
    aggregatedPredictions,
    metadata: {
      councilSize: enabledMembers.length,
      successfulMembers: memberPredictions.length,
      failedMembers,
      aggregationMethod: "mean",
      totalDurationMs,
    },
  };
}
