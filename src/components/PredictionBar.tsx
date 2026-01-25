interface PredictionBarProps {
  name: string;
  probability: number;
  rank?: number;
  showPercentage?: boolean;
}

const COLORS = [
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#22c55e", // green
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

export function PredictionBar({
  name,
  probability,
  rank = 0,
  showPercentage = true,
}: PredictionBarProps) {
  const percentage = probability * 100;
  const color = COLORS[rank % COLORS.length];

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-40 truncate text-sm font-medium">{name}</div>
      <div className="flex-1 h-8 bg-[var(--card-border)] rounded-md overflow-hidden relative">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.max(percentage, 1)}%`,
            backgroundColor: color,
          }}
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
