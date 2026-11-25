import { CafeTag, TagIconName } from "./types";

interface TagRule {
  label: string;
  icon: TagIconName;
  keywords: string[];
}

const TAG_RULES: TagRule[] = [
  {
    label: "WiFi Cepat",
    icon: "wifi",
    keywords: ["wifi", "wi-fi", "internet cepat", "koneksi bagus", "sinyal kuat"],
  },
  {
    label: "Musholla Bersih",
    icon: "prayer",
    keywords: ["musholla", "mushola", "musola", "solat", "sholat", "shalat", "ibadah"],
  },
  {
    label: "Cocok WFA/WFC",
    icon: "laptop",
    keywords: ["kerja", "laptop", "working", "wfa", "wfc", "freelance", "ngelab", "coworking", "produktif"],
  },
  {
    label: "Kids Friendly",
    icon: "baby",
    keywords: ["anak", "kids", "keluarga", "family", "ramah anak", "mainan", "bayi"],
  },
  {
    label: "Tempat Tenang",
    icon: "leaf",
    keywords: ["tenang", "nyaman", "sepi", "cozy", "adem", "quiet", "santai"],
  },
  {
    label: "Tempat Luas",
    icon: "expand",
    keywords: ["luas", "lapang", "besar", "spacious", "parkir luas", "banyak meja"],
  },
  {
    label: "Outdoor Area",
    icon: "sun",
    keywords: ["outdoor", "taman", "garden", "luar", "terbuka", "rooftop", "open air"],
  },
  {
    label: "Pet Friendly",
    icon: "paw",
    keywords: ["pet", "anjing", "kucing", "hewan", "bawa hewan"],
  },
  {
    label: "Instagramable",
    icon: "camera",
    keywords: ["estetik", "instagramable", "aesthetic", "foto", "cantik", "bagus banget tempatnya"],
  },
  {
    label: "Colokan Banyak",
    icon: "plug",
    keywords: ["colokan", "stop kontak", "charge", "cas", "listrik", "outlet"],
  },
];

export function parseTagsFromReviews(reviews: string[]): CafeTag[] {
  const combinedText = reviews.join(" ").toLowerCase();
  const foundTags: CafeTag[] = [];

  for (const rule of TAG_RULES) {
    if (rule.keywords.some((kw) => combinedText.includes(kw))) {
      foundTags.push({ label: rule.label, icon: rule.icon });
    }
  }
  return foundTags;
}

export function getAllTags(): CafeTag[] {
  return TAG_RULES.map((r) => ({ label: r.label, icon: r.icon }));
}