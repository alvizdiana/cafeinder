"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Cafe, FilterState, DEFAULT_FILTER } from "@/lib/types";
import { applyFilter } from "@/lib/applyFilter";
import dynamic from "next/dynamic";
import CafeList from "@/components/CafeList";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filteredCafes = useMemo(() => applyFilter(cafes, filter), [cafes, filter]);

  const activeSelectedId = filteredCafes.some((c) => c.placeId === selectedId)
    ? selectedId
    : null;

  const fetchCafes = useCallback(async (lat: number, lng: number, radius: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/places?lat=${lat}&lng=${lng}&radius=${radius}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCafes(data.cafes ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLat(coords.latitude);
        setUserLng(coords.longitude);
        fetchCafes(coords.latitude, coords.longitude, DEFAULT_FILTER.maxDistance);
      },
      () => setError("Akses lokasi ditolak. Izinkan lokasi lalu refresh."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilter: FilterState) => {
    setFilter(newFilter);
    if (userLat && userLng && newFilter.maxDistance !== filter.maxDistance) {
      fetchCafes(userLat, userLng, newFilter.maxDistance);
    }
  };

  const handleSelectCafe = useCallback((cafe: Cafe) => {
    setSelectedId((prev) => (prev === cafe.placeId ? null : cafe.placeId));
  }, []);

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-[#faf5ec]">
      {/* Header */}
      <header className="flex items-center gap-4 px-5 py-2.5 bg-[#3d1f00] text-[#faf5ec] shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <span className="font-playfair text-xl font-semibold tracking-tight">CafeInder</span>
        </div>
        <div className="hidden md:block ml-auto text-xs text-[#e8dcc8]">
          {userLat
            ? `📍 Lokasi terdeteksi · ${filteredCafes.length} cafe ditemukan`
            : "Meminta akses lokasi…"}
        </div>
        {error && (
          <div className="text-xs text-[#f9b88e] bg-white/10 px-2.5 py-1 rounded">
            ⚠ {error}
          </div>
        )}
      </header>

      {/* Split view */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Map: atas di HP, kiri di desktop */}
        <div className="relative min-w-0 h-[38%] shrink-0 md:h-auto md:flex-1">
          <MapView
            cafes={filteredCafes}
            userLat={userLat}
            userLng={userLng}
            selectedId={activeSelectedId}
            onSelectCafe={handleSelectCafe}
          />
        </div>

        {/* List: bawah di HP, kanan di desktop */}
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden border-t border-[#d9c9b0] bg-[#faf5ec] md:flex-none md:w-[380px] md:shrink-0 md:border-t-0 md:border-l">
          <CafeList
            cafes={filteredCafes}
            allCafes={cafes}
            loading={loading}
            filter={filter}
            onFilterChange={handleFilterChange}
            selectedId={activeSelectedId}
            onSelect={handleSelectCafe}
          />
        </div>
      </div>
    </div>
  );
}
