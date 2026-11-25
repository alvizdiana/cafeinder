import {
  Wifi, Moon, Laptop, Baby, Leaf, Maximize,
  Sun, PawPrint, Camera, Plug, Coffee, type LucideIcon,
} from "lucide-react";
import type { TagIconName } from "@/lib/types";

export const TAG_ICONS: Record<TagIconName, LucideIcon> = {
  wifi: Wifi,
  prayer: Moon,
  laptop: Laptop,
  baby: Baby,
  leaf: Leaf,
  expand: Maximize,
  sun: Sun,
  paw: PawPrint,
  camera: Camera,
  plug: Plug,
};

export const FALLBACK_ICON = Coffee;