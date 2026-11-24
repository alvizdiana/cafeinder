"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  placeId: string;
  cafeName: string;
  onClose: () => void;
}

export default function GalleryModal({ placeId, cafeName, onClose }: Props) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState<number | null>(null); // index foto yang diperbesar

  // ambil daftar foto
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/photos?placeId=${placeId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setPhotos(d.photos ?? []))
      .catch((e) => e.name !== "AbortError" && setError(true))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [placeId]);

  // keyboard + kunci scroll body
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        active !== null ? setActive(null) : onClose();
      } else if (active !== null && e.key === "ArrowRight") {
        setActive((i) => (i! + 1) % photos.length);
      } else if (active !== null && e.key === "ArrowLeft") {
        setActive((i) => (i! - 1 + photos.length) % photos.length);
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, photos.length, onClose]);

  const src = (ref: string, w: number) =>
  `/api/photo?ref=${encodeURIComponent(ref)}&maxwidth=${w}`;

  // portal ke body: menghindari masalah `fixed` di dalam parent yang punya transform
  return createPortal(
    <motion.div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-label={`Galeri ${cafeName}`}
        >
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-[#faf5ec] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#d9c9b0]">
            <h2 className="font-playfair text-lg text-[#3d1f00] truncate">
                Galeri · {cafeName}
            </h2>
            <button
                onClick={onClose}
                aria-label="Tutup galeri"
                className="text-[#6b3f1f] hover:text-[#3d1f00] text-2xl leading-none px-2"
            >
                ×
            </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto">
            {loading && <p className="text-sm text-[#a0856a] text-center py-10">Memuat foto…</p>}
            {error && <p className="text-sm text-red-700 text-center py-10">Gagal memuat foto.</p>}
            {!loading && !error && photos.length === 0 && (
                <p className="text-sm text-[#a0856a] text-center py-10">Belum ada foto untuk tempat ini.</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {photos.map((ref, i) => (
                <motion.button
                    key={ref}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActive(i)}
                    className="aspect-square overflow-hidden rounded-lg bg-[#f2e9d8]"
                >
                    <img
                    src={src(ref, 400)}
                    alt={`${cafeName} foto ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </motion.button>
                ))}
            </div>
            </div>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
            {active !== null && (
                <motion.div
                    key="lightbox"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 p-4"
                    onClick={(e) => { e.stopPropagation(); setActive(null); }}
                >
                <motion.img
                    key={active}
                    src={src(photos[active], 1200)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    alt={`${cafeName} foto ${active + 1}`}
                    className="max-h-full max-w-full object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
                    {photos.length > 1 && (
                        <>
                        <button
                            aria-label="Foto sebelumnya"
                            onClick={(e) => { e.stopPropagation(); setActive((active - 1 + photos.length) % photos.length); }}
                            className="absolute left-4 text-white text-4xl px-3"
                        >
                            ‹
                        </button>
                        <button
                            aria-label="Foto berikutnya"
                            onClick={(e) => { e.stopPropagation(); setActive((active + 1) % photos.length); }}
                            className="absolute right-4 text-white text-4xl px-3"
                        >
                            ›
                        </button>
                        </>
                    )}
                    <span className="absolute bottom-4 text-white/80 text-xs">
                        {active + 1} / {photos.length}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>,
    document.body
  );
}