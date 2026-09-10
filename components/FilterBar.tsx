"use client";

import { Cafe, FilterState } from "@/lib/types";
import { getAllTags } from "@/lib/tagParser";

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
      className={`px-2.5 py-1 rounded-full border text-xs cursor-pointer transition-all whitespace-nowrap font-[DM_Sans]
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
  const hasPriceData = (cafes ?? []).some((c) => c.priceLevel !== null);

  const toggleTag = (label: string) => {
    const active = filter.activeTags.includes(label)
      ? filter.activeTags.filter((t) => t !== label)
      : [...filter.activeTags, label];
    onChange({ ...filter, activeTags: active });
  };

  return (
    <div className="flex flex-col gap-3 p-3 border-b border-[#d9c9b0] bg-[#f2e9d8]">
      {/* Rating */}
      <FilterRow label="Rating">
        {RATING_OPTIONS.map((r) => (
          <Chip key={r} active={filter.minRating === r} onClick={() => onChange({ ...filter, minRating: r })}>
            {r === 0 ? "Semua" : `${r}★`}
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

      {/* Price — hanya tampil kalau ada data */}
      {hasPriceData && (
        <FilterRow label="Harga">
          <Chip active={filter.maxPrice === null} onClick={() => onChange({ ...filter, maxPrice: null })}>
            Semua
          </Chip>
          {[1, 2, 3].map((p) => (
            <Chip
              key={p}
              active={filter.maxPrice === p}
              onClick={() => onChange({ ...filter, maxPrice: p as 1 | 2 | 3 })}
            >
              {"Rp ".repeat(p).trim()}
            </Chip>
          ))}
        </FilterRow>
      )}

      {/* Tags */}
      <FilterRow label="Fasilitas">
        {allTags.map((tag) => (
          <Chip key={tag.label} active={filter.activeTags.includes(tag.label)} onClick={() => toggleTag(tag.label)}>
            {tag.icon} {tag.label}
          </Chip>
        ))}
      </FilterRow>
    </div>
  );
}
