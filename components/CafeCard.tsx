"use client";

import { Cafe } from "@/lib/types";
import TagBadge from "./TagBadge";
import { formatDistance, priceSymbol } from "@/lib/utils";

interface Props {
  cafe: Cafe;
  isSelected: boolean;
  onClick: () => void;
}

export default function CafeCard({ cafe, isSelected, onClick }: Props) {
  const photoUrl = cafe.photoReference
    ? `/api/photo?ref=${cafe.photoReference}&maxwidth=400`
    : null;

  const openMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${cafe.lat},${cafe.lng}` +
      `&destination_place_id=${cafe.placeId}`;
    window.open(url, "_blank");
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`bg-white rounded-xl border mb-2 overflow-hidden cursor-pointer transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        ${isSelected
          ? "border-[#6b3f1f] shadow-[0_0_0_2px_rgba(107,63,31,0.15)]"
          : "border-[#d9c9b0] hover:border-[#c07a3a]"
        }`}
    >
      {/* Photo */}
      {photoUrl ? (
        <div className="w-full h-28 overflow-hidden">
          <img
            src={photoUrl}
            alt={cafe.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full h-20 flex items-center justify-center bg-[#f2e9d8] text-4xl">
          ☕
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        {/* Name */}
        <h3 className="font-playfair text-[15px] font-medium text-[#3d1f00] leading-snug mb-1">
          {cafe.name}
        </h3>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <span className="text-xs text-[#a0856a]">📍 {formatDistance(cafe.distance)}</span>

          {cafe.priceLevel !== null && (
            <span className="text-[11px] text-[#8b5a2b] bg-[#f2e9d8] px-1.5 py-0.5 rounded font-medium">
              {priceSymbol(cafe.priceLevel)}
            </span>
          )}

          {cafe.openNow !== undefined && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
              ${cafe.openNow
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
              }`}
            >
              {cafe.openNow ? "Buka" : "Tutup"}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const full = Math.floor(cafe.rating);
            const half = cafe.rating - full >= 0.5;
            const cls = i < full
              ? "text-amber-400"
              : i === full && half
                ? "text-amber-300"
                : "text-[#d9c9b0]";
            return <span key={i} className={`text-sm ${cls}`}>★</span>;
          })}
          <span className="text-xs font-medium text-[#2c1500] ml-1">{cafe.rating.toFixed(1)}</span>
          <span className="text-[11px] text-[#7a5c40]">({cafe.userRatingsTotal.toLocaleString("id-ID")})</span>
        </div>

        {/* Address */}
        <p className="text-[11px] text-[#a0856a] mb-2 truncate">{cafe.vicinity}</p>

        {/* Tags */}
        {cafe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {cafe.tags.map((tag) => (
              <TagBadge key={tag.label} tag={tag} />
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={openMaps}
          aria-label="Buka rute di Google Maps"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3d1f00] hover:bg-[#6b3f1f] text-[#faf5ec] text-xs font-medium rounded-md transition-colors duration-150"
        >
          <span>🗺️</span>
          <span>Lihat Rute</span>
        </button>
      </div>
    </div>
  );
}
