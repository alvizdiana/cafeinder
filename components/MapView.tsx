"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Cafe } from "@/lib/types";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

interface Props {
  cafes: Cafe[];
  userLat: number | null;
  userLng: number | null;
  selectedId: string | null;
  onSelectCafe: (cafe: Cafe) => void;
}

declare global {
  interface Window {
    google: typeof google;
    initCafeMap: () => void;
  }
}

export default function MapView({ cafes, userLat, userLng, selectedId, onSelectCafe }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const cafesRef = useRef(cafes);
  const onSelectRef = useRef(onSelectCafe);
  const mapReady = useSyncExternalStore(
    subscribe,
    () => !!window.google?.maps,  // snapshot klien
    () => false                    // snapshot server
  );

  useEffect(() => {
    cafesRef.current = cafes;
    onSelectRef.current = onSelectCafe;
  }, [cafes, onSelectCafe]);

  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  const markerIcon = (selected: boolean): google.maps.Symbol => ({
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
    fillColor: selected ? "#3d1f00" : "#C07A3A",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 1.5,
    scale: selected ? 2 : 1.5,
    anchor: new window.google.maps.Point(12, 22),
  });

  useEffect(() => {
    if (window.google?.maps) return;
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!key) return;

    const handleReady = () => listeners.forEach((l) => l());

    const existing = document.getElementById("gmaps-script");
    if (existing) {
      // script sedang dimuat oleh instance lain, tunggu sampai selesai
      existing.addEventListener("load", handleReady);
      return () => existing.removeEventListener("load", handleReady);
    }

    window.initCafeMap = () => listeners.forEach((l) => l());
    const script = document.createElement("script");
    script.id = "gmaps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initCafeMap&language=id`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstance.current) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: userLat ?? -6.2, lng: userLng ?? 106.816 },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#f5efe6" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d8e8" }] },
        { featureType: "landscape", stylers: [{ color: "#f0e8d8" }] },
        { featureType: "poi.business", elementType: "labels", stylers: [{ visibility: "off" }] },
      ],
    });
  }, [mapReady, userLat, userLng]);

  useEffect(() => {
    if (!mapInstance.current || !userLat || !userLng) return;

    userMarkerRef.current?.setMap(null);

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="10" fill="#C07A3A" opacity="0.45">
          <animate attributeName="r" from="10" to="34" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.45" to="0" dur="2.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="36" cy="36" r="10" fill="#C07A3A" opacity="0.45">
          <animate attributeName="r" from="10" to="34" dur="2.4s" begin="1.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.45" to="0" dur="2.4s" begin="1.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="36" cy="36" r="10" fill="#6B3F1F" stroke="#ffffff" stroke-width="3">
          <animate attributeName="r" values="10;11.5;10" dur="2.4s" repeatCount="indefinite"/>
        </circle>
      </svg>`;

    const marker = new window.google.maps.Marker({
      position: { lat: userLat, lng: userLng },
      map: mapInstance.current,
      title: "Lokasi Anda",
      optimized: false,
      clickable: false,
      zIndex: 100,
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new window.google.maps.Size(72, 72),
        anchor: new window.google.maps.Point(36, 36),
      },
    });

    userMarkerRef.current = marker;
    mapInstance.current.panTo({ lat: userLat, lng: userLng });

    return () => marker.setMap(null);
  }, [userLat, userLng, mapReady]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!mapReady || !map) return;

    const newIds = new Set(cafes.map((c) => c.placeId));

    markersRef.current.forEach((marker, id) => {
      if (!newIds.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    cafes.forEach((cafe, i) => {
      if (markersRef.current.has(cafe.placeId)) return;

      const marker = new window.google.maps.Marker({
        position: { lat: cafe.lat, lng: cafe.lng },
        map: null,
        title: cafe.name,
        icon: markerIcon(cafe.placeId === selectedId),
      });

      marker.addListener("click", () => onSelectRef.current(cafe));
      markersRef.current.set(cafe.placeId, marker);

      setTimeout(() => {
        if (markersRef.current.get(cafe.placeId) !== marker) return;
        marker.setMap(map);
        marker.setAnimation(window.google.maps.Animation.DROP);
      }, Math.min(i, 12) * 60);
    });
  }, [cafes, mapReady]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!mapReady || !map) return;

    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }
    const infoWindow = infoWindowRef.current;

    markersRef.current.forEach((marker, id) => {
      const sel = id === selectedId;
      marker.setIcon(markerIcon(sel));
      marker.setZIndex(sel ? 999 : null);
    });

    if (!selectedId) {
      infoWindow.close();
      return;
    }

    const marker = markersRef.current.get(selectedId);
    const cafe = cafesRef.current.find((c) => c.placeId === selectedId);
    if (!marker || !cafe) return;

    infoWindow.setContent(`
      <div style="font-family:sans-serif;padding:4px;min-width:160px">
        <strong style="color:#3d1f00;font-size:14px">${esc(cafe.name)}</strong>
        <div style="color:#888;font-size:12px;margin-top:2px">${cafe.rating}★ · ${esc(cafe.vicinity)}</div>
      </div>
    `);
    infoWindow.open({ map, anchor: marker });

    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    const t = setTimeout(() => marker.setAnimation(null), 1400);

    map.panTo({ lat: cafe.lat, lng: cafe.lng });
    map.setZoom(17);

    return () => clearTimeout(t);
  }, [selectedId, mapReady]);

  useEffect(() => {
    if (!selectedId || !mapInstance.current) return;
    const cafe = cafes.find((c) => c.placeId === selectedId);
    if (cafe) { mapInstance.current.panTo({ lat: cafe.lat, lng: cafe.lng }); mapInstance.current.setZoom(17); }
  }, [selectedId, cafes]);

  useEffect(() => {
    if (!mapInstance.current) return;
    markersRef.current.forEach((marker, id) => {
      marker.setIcon({
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
        fillColor: id === selectedId ? "#3d1f00" : "#C07A3A",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 1.5,
        scale: id === selectedId ? 2 : 1.5,
        anchor: new window.google.maps.Point(12, 22),
      });
    });
  }, [selectedId]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#faf5ec] gap-3 text-[#7a5c40] text-sm">
          <div className="spinner" />
          <p>Memuat peta…</p>
        </div>
      )}
    </div>
  );
}
