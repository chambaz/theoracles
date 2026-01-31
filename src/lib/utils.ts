import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sort prediction entries. For binary yes/no markets, always show
 * Yes first, No second. For all other markets, sort by probability
 * descending.
 */
export function sortPredictions(
  entries: [string, number][]
): [string, number][] {
  const ids = entries.map(([id]) => id);
  const isBinary =
    ids.length === 2 &&
    ids.includes("yes") &&
    ids.includes("no");

  if (isBinary) {
    return [...entries].sort(([a]) => (a === "yes" ? -1 : 1));
  }

  return [...entries].sort(([, a], [, b]) => b - a);
}
