import { CafeTag } from "./types";

interface TagRule {
  label: string;
  icon: string;
  keywords: string[];
}

const TAG_RULES: TagRule[] = [
  {
    label: "WiFi Cepat",
    icon: "📶",
    keywords: ["wifi", "wi-fi", "internet cepat", "koneksi bagus", "sinyal kuat", "ngebut"],
  },
  {
    label: "Musholla Bersih",
    icon: "🕌",
    keywords: ["musholla", "mushola", "musola", "solat", "sholat", "shalat", "ibadah"],
  },
  {
    label: "Cocok WFA/WFC",
    icon: "💻",
    keywords: ["kerja", "laptop", "working", "wfa", "wfc", "freelance", "ngelab", "coworking", "produktif"],
  },
  {
    label: "Kids Friendly",
    icon: "👶",
    keywords: ["anak", "kids", "keluarga", "family", "ramah anak", "mainan", "bayi"],
  },
  {
    label: "Tempat Tenang",
    icon: "🌿",
    keywords: ["tenang", "nyaman", "sepi", "cozy", "adem", "quiet", "santai"],
  },
  {
    label: "Tempat Luas",
    icon: "🏠",
    keywords: ["luas", "lapang", "besar", "spacious", "parkir luas", "banyak meja"],
  },
  {
    label: "Outdoor Area",
    icon: "☀️",
    keywords: ["outdoor", "taman", "garden", "luar", "terbuka", "rooftop", "open air"],
  },
  {
    label: "Pet Friendly",
    icon: "🐾",
    keywords: ["pet", "anjing", "kucing", "hewan", "bawa hewan"],
  },
  {
    label: "Instagramable",
    icon: "📸",
    keywords: ["estetik", "instagramable", "aesthetic", "foto", "cantik", "bagus banget tempatnya"],
  },
  {
    label: "Colokan Banyak",
    icon: "🔌",
    keywords: ["colokan", "stop kontak", "charge", "cas", "listrik", "outlet"],
  },
];

export function parseTagsFromReviews(reviews: string[]): CafeTag[] {
  const combinedText = reviews.join(" ").toLowerCase();
  const foundTags: CafeTag[] = [];

  for (const rule of TAG_RULES) {
    const matched = rule.keywords.some((kw) => combinedText.includes(kw));
    if (matched) {
      foundTags.push({ label: rule.label, icon: rule.icon });
    }
  }

  return foundTags;
}

export function getAllTags(): CafeTag[] {
  return TAG_RULES.map((r) => ({ label: r.label, icon: r.icon }));
}
