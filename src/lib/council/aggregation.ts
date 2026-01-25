import type { ModelPrediction } from "@/types";

/**
 * Aggregate predictions from multiple models using mean averaging
 */
export function aggregatePredictions(
  memberPredictions: ModelPrediction[]
): Record<string, number> {
  if (memberPredictions.length === 0) {
    return {};
  }

  // Get all unique option IDs from all predictions
  const allOptionIds = new Set<string>();
  for (const prediction of memberPredictions) {
    for (const optionId of Object.keys(prediction.predictions)) {
      allOptionIds.add(optionId);
    }
  }

  // Calculate mean for each option
  const aggregated: Record<string, number> = {};
  for (const optionId of allOptionIds) {
    const values = memberPredictions
      .map((p) => p.predictions[optionId])
      .filter((v) => v !== undefined);

    if (values.length > 0) {
      aggregated[optionId] = values.reduce((sum, v) => sum + v, 0) / values.length;
    }
  }

  // Normalize to ensure sum is exactly 1.0
  const total = Object.values(aggregated).reduce((sum, v) => sum + v, 0);
  if (total > 0) {
    for (const key of Object.keys(aggregated)) {
      aggregated[key] = aggregated[key] / total;
    }
  }

  return aggregated;
}
