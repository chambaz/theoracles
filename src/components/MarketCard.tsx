import Link from "next/link";
import type { Market, CouncilPrediction } from "@/types";
import { PredictionBar } from "./PredictionBar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sortPredictions } from "@/lib/utils";

interface MarketCardProps {
  market: Market;
  prediction?: CouncilPrediction | null;
}

export function MarketCard({ market, prediction }: MarketCardProps) {
  const sortedPredictions = prediction
    ? sortPredictions(Object.entries(prediction.aggregatedPredictions))
        .slice(0, 3)
    : [];

  const getOptionName = (optionId: string) => {
    return market.options.find((o) => o.id === optionId)?.name || optionId;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link href={`/market/${market.id}`} className="h-full">
      <Card className="group h-full flex flex-col hover:border-muted-foreground/30 transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-lg leading-tight underline decoration-transparent group-hover:decoration-foreground underline-offset-4 transition-colors duration-300">
              {market.title}
            </h2>
            <Badge variant="secondary" className="shrink-0">
              {market.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {sortedPredictions.length > 0 ? (
            <div className="space-y-1">
              {sortedPredictions.map(([optionId, probability], index) => (
                <PredictionBar
                  key={optionId}
                  name={getOptionName(optionId)}
                  probability={probability}
                  rank={index}
                />
              ))}
              {market.options.length > 3 && (
                <p className="text-xs text-muted-foreground mt-2">
                  +{market.options.length - 3} more options
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No predictions yet
            </p>
          )}
        </CardContent>

        <CardFooter className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
          {market.resolutionDate && (
            <span>
              Resolves{" "}
              {new Date(market.resolutionDate).toLocaleDateString()}
            </span>
          )}
          {prediction && (
            <span>Updated {formatDate(prediction.timestamp)}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
