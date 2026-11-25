export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatPrice(level: number | null): string {
  if (level === null) return "–";
  return ["Gratis", "Murah", "Sedang", "Mahal", "Mewah"][level] ?? "–";
}

const idr = (n: number) => n.toLocaleString("id-ID");

// Estimasi kasar kalau Google tidak punya rentang. Sesuaikan dengan harga lokal.
export const LEVEL_RANGE: Record<number, string> = {
  1: "< Rp 25.000",
  2: "Rp 26.000–50.000",
  3: "Rp 51.000–75.000",
  4: "> Rp 75.000",
};

export function priceLevelLabel(level: number): string {
  return LEVEL_RANGE[level] ?? "–";
}

export function priceSymbol(
  level: number | null,
  min?: number | null,
  max?: number | null
): string {
  if (min != null && max != null) return `Rp ${idr(min)}–${idr(max)}`;
  if (min != null) return `Rp ${idr(min)}+`;
  if (max != null) return `< Rp ${idr(max)}`;
  if (level != null && LEVEL_RANGE[level]) return `~${LEVEL_RANGE[level]}`;
  return "–";
}
