"use client";

import { useState } from "react";
import type { ModelPrediction, MarketOption } from "@/types";
import { PredictionBar } from "./PredictionBar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ModelPredictionCardProps {
  prediction: ModelPrediction;
  options: MarketOption[];
}

export function ModelPredictionCard({
  prediction,
  options,
}: ModelPredictionCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);

  const sortedPredictions = Object.entries(prediction.predictions).sort(
    ([, a], [, b]) => b - a,
  );

  const getOptionName = (optionId: string) => {
    return options.find((o) => o.id === optionId)?.name || optionId;
  };

  return (
    <Card className="overflow-hidden pb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{prediction.modelName}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{(prediction.confidence * 100).toFixed(0)}% confident</span>
            <span>{prediction.searchQueries.length} searches</span>
            <span>{(prediction.durationMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        {sortedPredictions.map(([optionId, probability], index) => (
          <PredictionBar
            key={optionId}
            name={getOptionName(optionId)}
            probability={probability}
            rank={index}
          />
        ))}
      </CardContent>

      <CardFooter className="border-t flex-col items-stretch gap-4 [.border-t]:pt-4">
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center gap-2 justify-center text-sm cursor-pointer"
        >
          {showReasoning ? (
            <>
              Hide reasoning
              <ChevronUp size={12} />
            </>
          ) : (
            <>
              Show reasoning
              <ChevronDown size={12} />
            </>
          )}
        </button>

        {showReasoning && (
          <div className="space-y-3">
            <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted rounded-md p-3">
              {prediction.reasoning}
            </div>

            {prediction.sources.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                <ul className="text-xs space-y-1">
                  {prediction.sources.map((source, i) => (
                    <li key={i}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {source}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prediction.searchQueries.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Search queries:
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {prediction.searchQueries.map((query, i) => (
                    <li key={i}>{query}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
