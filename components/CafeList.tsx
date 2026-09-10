"use client";

import { Cafe, FilterState } from "@/lib/types";
import CafeCard from "./CafeCard";
import FilterBar from "./FilterBar";

interface Props {
  cafes: Cafe[];
  loading: boolean;
  filter: FilterState;
  onFilterChange: (f: FilterState) => void;
  selectedId: string | null;
  onSelect: (cafe: Cafe) => void;
}

function applyFilter(cafes: Cafe[], filter: FilterState): Cafe[] {
  return cafes.filter((c) => {
    if (c.rating < filter.minRating) return false;
    if (c.distance > filter.maxDistance) return false;
    if (filter.maxPrice !== null && c.priceLevel !== null && c.priceLevel > filter.maxPrice) return false;
    if (filter.activeTags.length > 0) {
      const cafeTagLabels = c.tags.map((t) => t.label);
      if (!filter.activeTags.every((t) => cafeTagLabels.includes(t))) return false;
    }
    return true;
  });
}

export default function CafeList({ cafes, loading, filter, onFilterChange, selectedId, onSelect }: Props) {
  const filtered = applyFilter(cafes, filter);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FilterBar filter={filter} onChange={onFilterChange} cafes={cafes} />

      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-[#e8dcc8]">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#7a5c40] text-sm">
            <div className="spinner" />
            <p>Mencari cafe terdekat…</p>
          </div>
        )}

        {/* No results after filter */}
        {!loading && filtered.length === 0 && cafes.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#7a5c40] text-sm text-center">
            <span className="text-4xl">☕</span>
            <p>Tidak ada cafe yang cocok dengan filter.</p>
            <button
              onClick={() => onFilterChange({ minRating: 0, maxDistance: 2000, maxPrice: null, activeTags: [] })}
              className="px-4 py-1.5 border border-[#d9c9b0] rounded-full text-[#6b3f1f] text-xs hover:bg-[#f2e9d8] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* No location yet */}
        {!loading && cafes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#7a5c40] text-sm text-center">
            <span className="text-4xl">📍</span>
            <p>Izinkan akses lokasi untuk mencari cafe terdekat.</p>
          </div>
        )}

        {/* Cafe list */}
        {!loading && filtered.map((cafe) => (
          <CafeCard
            key={cafe.placeId}
            cafe={cafe}
            isSelected={cafe.placeId === selectedId}
            onClick={() => onSelect(cafe)}
          />
        ))}

        {/* Result count */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-[11px] text-[#a0856a] py-2">
            {filtered.length} cafe ditemukan
          </p>
        )}
      </div>
    </div>
  );
}
