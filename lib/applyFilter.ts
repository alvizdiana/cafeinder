import { Cafe, FilterState } from "@/lib/types";

export function applyFilter(cafes: Cafe[], filter: FilterState): Cafe[] {
  return cafes.filter((c) => {
    if (c.rating < filter.minRating) return false;
    if (c.distance > filter.maxDistance) return false;
    if (filter.maxPrice !== null && c.priceLevel != null && c.priceLevel > filter.maxPrice) return false;
    if (filter.activeTags.length > 0) {
      const labels = c.tags.map((t) => t.label);
      if (!filter.activeTags.every((t) => labels.includes(t))) return false;
    }
    return true;
  });
}