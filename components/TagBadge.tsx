import { CafeTag } from "@/lib/types";
import { TAG_ICONS, FALLBACK_ICON } from "./tagIcons";

export default function TagBadge({ tag }: { tag: CafeTag }) {
  const Icon = TAG_ICONS[tag.icon] ?? FALLBACK_ICON;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f2e9d8] border border-[#e8dcc8] text-[10px] text-[#8b5a2b] font-medium whitespace-nowrap">
      <span><Icon size={12} strokeWidth={2} /></span>
      <span>{tag.label}</span>
    </span>
  );
}
