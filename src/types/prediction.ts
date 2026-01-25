export interface ModelPrediction {
  model: string;
  modelName: string;
  predictions: Record<string, number>;
  reasoning: string;
  sources: string[];
  searchQueries: string[];
  confidence: number;
  timestamp: string;
  durationMs: number;
}

export interface CouncilPrediction {
  id: string;
  marketId: string;
  timestamp: string;
  memberPredictions: ModelPrediction[];
  aggregatedPredictions: Record<string, number>;
  metadata: {
    councilSize: number;
    successfulMembers: number;
    failedMembers: string[];
    aggregationMethod: "mean";
    totalDurationMs: number;
  };
}
