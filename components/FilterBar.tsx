"use client";

import { Cafe, FilterState, DEFAULT_FILTER } from "@/lib/types";
import { getAllTags } from "@/lib/tagParser";
import { TAG_ICONS, FALLBACK_ICON } from "./tagIcons";
import { RotateCcw, Star } from "lucide-react";

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  cafes: Cafe[];
}

const DISTANCE_OPTIONS = [
  { label: "500 m", value: 500 },
  { label: "1 km", value: 1000 },
  { label: "2 km", value: 2000 },
  { label: "5 km", value: 5000 },
];

const RATING_OPTIONS = [0, 3, 3.5, 4, 4.5];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full border text-xs cursor-pointer whitespace-nowrap font-[DM_Sans] transition-transform duration-150 hover:scale-105 active:scale-95
        ${active
          ? "bg-[#3d1f00] border-[#3d1f00] text-[#faf5ec]"
          : "bg-[#faf5ec] border-[#d9c9b0] text-[#7a5c40] hover:border-[#c07a3a] hover:text-[#6b3f1f]"
        }`}
    >
      {children}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[11px] font-medium text-[#a0856a] uppercase tracking-wider min-w-[64px] shrink-0 pt-1">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export default function FilterBar({ filter, onChange, cafes }: Props) {
  const allTags = getAllTags();

  const toggleTag = (label: string) => {
    const active = filter.activeTags.includes(label)
      ? filter.activeTags.filter((t) => t !== label)
      : [...filter.activeTags, label];
    onChange({ ...filter, activeTags: active });
  };

  const isDirty =
    filter.minRating !== DEFAULT_FILTER.minRating ||
    filter.maxDistance !== DEFAULT_FILTER.maxDistance ||
    filter.maxPrice !== DEFAULT_FILTER.maxPrice ||
    filter.activeTags.length > 0;

  const resetFilter = () => onChange({ ...DEFAULT_FILTER, activeTags: [] });

  return (
    <div className="flex flex-col gap-3 p-3 border-b border-[#d9c9b0] bg-[#f2e9d8]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#7a5c40]">Filter</span>
        <button
          type="button"
          onClick={resetFilter}
          disabled={!isDirty}
          className={`px-2.5 py-1 rounded-full border text-xs transition-all font-[DM_Sans]
            ${isDirty
              ? "bg-[#faf5ec] border-[#c07a3a] text-[#6b3f1f] cursor-pointer hover:bg-[#3d1f00] hover:border-[#3d1f00] hover:text-[#faf5ec]"
              : "bg-transparent border-[#e6dac6] text-[#c4b39b] cursor-not-allowed"
            }`}
        >
          <span className="inline-flex items-center gap-1">
            <RotateCcw size={14} /> Reset filter
          </span>
        </button>
      </div>

      {/* Rating */}
      <FilterRow label="Rating">
        {RATING_OPTIONS.map((r) => (
          <Chip key={r} active={filter.minRating === r} onClick={() => onChange({ ...filter, minRating: r })}>
            {r === 0 ? "Semua" : (
              <span className="inline-flex items-center gap-1">
                {r} <Star size={11} className="fill-current" />
              </span>
            )}
          </Chip>
        ))}
      </FilterRow>

      {/* Distance */}
      <FilterRow label="Jarak">
        {DISTANCE_OPTIONS.map((d) => (
          <Chip key={d.value} active={filter.maxDistance === d.value} onClick={() => onChange({ ...filter, maxDistance: d.value })}>
            {d.label}
          </Chip>
        ))}
      </FilterRow>

      {/* Tags */}
      <FilterRow label="Fasilitas">
        {allTags.map((tag) => {
          const Icon = TAG_ICONS[tag.icon] ?? FALLBACK_ICON;
          return (
            <Chip
              key={tag.label}
              active={filter.activeTags.includes(tag.label)}
              onClick={() => toggleTag(tag.label)}
            >
              <span className="flex items-center gap-1">
                <Icon size={13} strokeWidth={2} />
                {tag.label}
              </span>
            </Chip>
          );
        })}
      </FilterRow>
    </div>
  );
}
