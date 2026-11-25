import type { LucideIcon } from "lucide-react";

export type PriceLevel = 0 | 1 | 2 | 3 | 4;


export type TagIconName =
  | "wifi" | "prayer" | "laptop" | "baby" | "leaf"
  | "expand" | "sun" | "paw" | "camera" | "plug";

export interface CafeTag {
  label: string;
  icon: TagIconName; // string biasa, aman lewat JSON
}

export interface Cafe {
  placeId: string;
  name: string;
  vicinity: string;
  lat: number;
  lng: number;
  rating: number;
  userRatingsTotal: number;
  priceLevel: PriceLevel | null;
  priceMin: number | null; // dalam rupiah
  priceMax: number | null;
  distance: number; // meters
  photoReference?: string;
  openNow?: boolean;
  tags: CafeTag[];
}

export interface FilterState {
  minRating: number;
  maxDistance: number; // meters
  maxPrice: PriceLevel | null;
  activeTags: string[];
}

export const DEFAULT_FILTER: FilterState = {
  minRating: 0,
  maxDistance: 2000,
  maxPrice: null,
  activeTags: [],
};

export interface NearbySearchResult {
  cafes: Cafe[];
  error?: string;
}
