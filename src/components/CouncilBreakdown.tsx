import type { CouncilPrediction, MarketOption } from "@/types";
import { ModelPredictionCard } from "./ModelPredictionCard";

interface CouncilBreakdownProps {
  prediction: CouncilPrediction;
  options: MarketOption[];
}

export function CouncilBreakdown({
  prediction,
  options,
}: CouncilBreakdownProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Council Breakdown</h2>
        <div className="text-sm text-muted-foreground">
          {prediction.metadata.successfulMembers}/
          {prediction.metadata.councilSize} members
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {prediction.memberPredictions.map((memberPred) => (
          <ModelPredictionCard
            key={memberPred.model}
            prediction={memberPred}
            options={options}
          />
        ))}
      </div>

      {prediction.metadata.failedMembers.length > 0 && (
        <p className="text-sm text-destructive mt-4">
          Failed: {prediction.metadata.failedMembers.join(", ")}
        </p>
      )}
    </div>
  );
}
