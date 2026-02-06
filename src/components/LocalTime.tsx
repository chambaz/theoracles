"use client";

interface LocalTimeProps {
  timestamp: string;
  className?: string;
}

export function LocalTime({ timestamp, className }: LocalTimeProps) {
  const formatted = new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return <span className={className}>{formatted}</span>;
}
