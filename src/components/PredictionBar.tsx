interface PredictionBarProps {
  name: string;
  probability: number;
  rank?: number;
  showPercentage?: boolean;
}

const COLORS = [
  "bg-blue-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-lime-500",
];

export function PredictionBar({
  name,
  probability,
  rank = 0,
  showPercentage = true,
}: PredictionBarProps) {
  const percentage = probability * 100;
  const colorClass = COLORS[rank % COLORS.length];

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-40 truncate text-sm font-medium">{name}</div>
      <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden relative">
        <div
          className={`h-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${Math.max(percentage, 1)}%` }}
        />
        {showPercentage && (
          <span className="absolute inset-0 flex items-center px-3 text-sm font-semibold">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
