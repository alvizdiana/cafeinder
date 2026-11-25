"use client";

import { Cafe } from "@/lib/types";
import TagBadge from "./TagBadge";
import { formatDistance, priceSymbol } from "@/lib/utils";
import { useState } from "react";
import GalleryModal from "./GalleryModal";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Coffee, Navigation, Images, Star } from "lucide-react";

interface Props {
  cafe: Cafe;
  isSelected: boolean;
  onClick: () => void;
  index?: number; //untuk stagger
}

export default function CafeCard({ cafe, isSelected, onClick, index = 0 }: Props) {
  const photoUrl = cafe.photoReference
    ? `/api/photo?ref=${cafe.photoReference}&maxwidth=400`
    : null;

  const [showGallery, setShowGallery] = useState(false);

  const openMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${cafe.lat},${cafe.lng}` +
      `&destination_place_id=${cafe.placeId}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      layout="position"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 300, damping: 26, delay: Math.min(index, 8) * 0.04 }}
      whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(61,31,0,0.12)" }}
      whileTap={{ scale: 0.985 }}
      className={`bg-white rounded-xl border mb-2 overflow-hidden cursor-pointer hover:shadow-md
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
          <Coffee size={32} strokeWidth={1.5} />
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        {/* Name + Gallery */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-playfair text-[15px] font-medium text-[#3d1f00] leading-snug">
            {cafe.name}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={(e) => {
              e.stopPropagation(); // jangan memicu onClick kartu
              setShowGallery(true);
            }}
            aria-label={`Lihat galeri ${cafe.name}`}
            className="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#6b3f1f] bg-[#f2e9d8] hover:bg-[#e8d9bf] rounded-md transition-colors"
          >
            <Images size={14} strokeWidth={2} />
            <span>Galeri</span>
          </motion.button>
        </div>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <span className="inline-flex items-center gap-1 text-xs text-[#a0856a]">
            <MapPin size={12} />
            {formatDistance(cafe.distance)}
          </span>

          {(cafe.priceLevel !== null || cafe.priceMin !== null) && (
            <span className="text-[11px] text-[#8b5a2b] bg-[#f2e9d8] px-1.5 py-0.5 rounded font-medium">
              {priceSymbol(cafe.priceLevel, cafe.priceMin, cafe.priceMax)}
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
        <div className="flex items-center gap-0.5 mb-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const fill = Math.max(0, Math.min(1, cafe.rating - i)); // 0..1
            return (
              <span key={i} className="relative inline-block w-3.5 h-3.5">
                <Star size={14} className="absolute inset-0 text-[#d9c9b0]" />
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                </span>
              </span>
            );
          })}
          <span className="text-xs font-medium text-[#2c1500] ml-1">{cafe.rating.toFixed(1)}</span>
          <span className="text-[11px] text-[#7a5c40]">({cafe.userRatingsTotal.toLocaleString("id-ID")})</span>
        </div>

        {/* Address */}
        <p className="text-[11px] text-[#a0856a] mb-2 truncate">{cafe.vicinity}</p>

        {/* Tags */}
        <AnimatePresence initial={false}>
          {isSelected && cafe.tags.length > 0 && (
            <motion.div
            key="tags"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1 mb-2.5">
              {cafe.tags.map((tag) => (
                <TagBadge key={tag.label} tag={tag} />
              ))}
            </div>
          </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={openMaps}
          aria-label="Buka rute di Google Maps"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3d1f00] hover:bg-[#6b3f1f] text-[#faf5ec] text-xs font-medium rounded-md transition-colors duration-150"
        >
          <Navigation size={13} strokeWidth={2} />
          <span>Lihat Rute</span>
        </motion.button>
      </div>

      {showGallery && (
        <AnimatePresence>
          {showGallery && (
            <GalleryModal placeId={cafe.placeId} cafeName={cafe.name} onClose={() => setShowGallery(false)} />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
