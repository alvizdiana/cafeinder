"use client";

import { Cafe, FilterState, DEFAULT_FILTER } from "@/lib/types";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CafeCard from "./CafeCard";
import FilterBar from "./FilterBar";

interface Props {
  cafes: Cafe[];
  allCafes: Cafe[];
  loading: boolean;
  filter: FilterState;
  onFilterChange: (f: FilterState) => void;
  selectedId: string | null;
  onSelect: (cafe: Cafe) => void;
}

export default function CafeList({ cafes, allCafes, loading, filter, onFilterChange, selectedId, onSelect }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);

  const activeCount =
    (filter.minRating !== DEFAULT_FILTER.minRating ? 1 : 0) +
    (filter.maxDistance !== DEFAULT_FILTER.maxDistance ? 1 : 0) +
    (filter.maxPrice !== DEFAULT_FILTER.maxPrice ? 1 : 0) +
    filter.activeTags.length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Burger: hanya di mobile */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#d9c9b0] bg-[#f2e9d8] md:hidden">
        <span className="text-xs text-[#7a5c40]">Lokasi terdeteksi • {cafes.length} cafe ditemukan</span>
        <button
          type="button"
          onClick={() => setFilterOpen((o) => !o)}
          aria-expanded={filterOpen}
          aria-controls="filter-panel"
          aria-label="Buka atau tutup filter"
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d9c9b0] bg-[#faf5ec] text-[#6b3f1f] text-xs"
        >
          <span className="flex flex-col gap-[3px]">
            <span className="block w-4 h-[2px] bg-current" />
            <span className="block w-4 h-[2px] bg-current" />
            <span className="block w-4 h-[2px] bg-current" />
          </span>
          Filter
          {activeCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#3d1f00] text-[#faf5ec] text-[10px] flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter: tersembunyi di mobile sampai dibuka, selalu tampil di desktop */}
      <div
        id="filter-panel"
        className={`${filterOpen ? "block" : "hidden"} md:block max-h-[45vh] overflow-y-auto md:max-h-none md:overflow-visible`}
      >
        <FilterBar filter={filter} onChange={onFilterChange} cafes={allCafes} />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-[#e8dcc8]">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#7a5c40] text-sm">
            <div className="spinner" />
            <p>Mencari cafe terdekat…</p>
          </div>
        )}

        {/* No results after filter */}
        {!loading && cafes.length === 0 && allCafes.length > 0 && (
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
        {!loading && allCafes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-3 text-[#7a5c40] text-sm text-center">
            <span className="text-4xl">📍</span>
            <p>Izinkan akses lokasi untuk mencari cafe terdekat.</p>
          </motion.div>
        )}

        {/* Cafe list */}
        <AnimatePresence initial={false}>
          {!loading && cafes.map((cafe) => (
            <CafeCard
              key={cafe.placeId}
              cafe={cafe}
              isSelected={cafe.placeId === selectedId}
              onClick={() => onSelect(cafe)}
            />
          ))}
        </AnimatePresence>

        {/* Result count */}
        {!loading && cafes.length > 0 && (
          <p className="text-center text-[11px] text-[#a0856a] py-2">
            {cafes.length} cafe ditemukan
          </p>
        )}
      </div>
    </div>
  );
}
