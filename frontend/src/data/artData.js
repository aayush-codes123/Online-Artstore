export const CURATED_ARTWORKS = [
  {
    _id: "art-1",
    title: "Ethereal Solitude in Ultramarine",
    description: "An expressive study in deep mineral blues and textural palette knife strokes capturing midnight tranquility.",
    price: 32000,
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
    category: "Oil Painting",
    status: "Available",
    sellerName: "Aria Vance",
    details: {
      paperQuality: "Belgian Linen Canvas (450gsm)",
      brushType: "Mongoose Hair & Steel Palette Knife",
      strokeCount: "Impasto layered in 14 passes",
      dimensions: "36 x 48 inches",
      year: "2024"
    }
  },
  {
    _id: "art-2",
    title: "Symphony of Terracotta & Ochre",
    description: "Geometric harmony inspired by Mediterranean earth pigments, sculptural light, and ancient architectural forms.",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
    category: "Abstract",
    status: "Available",
    sellerName: "Marcus Sterling",
    details: {
      paperQuality: "Heavyweight Arches Cotton (640gsm)",
      brushType: "Japanese Hake & Natural Sponge",
      strokeCount: "Multi-layered translucent wash",
      dimensions: "40 x 50 inches",
      year: "2024"
    }
  },
  {
    _id: "art-3",
    title: "Silent Horizon & Golden Drift",
    description: "Delicate atmospheric illumination using 24k gold leaf inclusions and fluid acrylic glaze layers.",
    price: 58000,
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop",
    category: "Modern",
    status: "Available",
    sellerName: "Elena Rostova",
    details: {
      paperQuality: "Gessoed Hardboard Panel",
      brushType: "Kolinsky Sable & Gilding Tip",
      strokeCount: "Fine stippling with gilded accents",
      dimensions: "30 x 40 inches",
      year: "2023"
    }
  },
  {
    _id: "art-4",
    title: "Whispers of the Cedar Grove",
    description: "Soft watercolor atmospheric depth portraying dawn fog rising through highland pine canopies.",
    price: 24500,
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1200&auto=format&fit=crop",
    category: "Watercolor",
    status: "Sold",
    sellerName: "Kaelen Chen",
    details: {
      paperQuality: "Saunders Waterford Rough 300gsm",
      brushType: "Squirrel Quill Mop",
      strokeCount: "Wet-on-wet spontaneous blending",
      dimensions: "24 x 36 inches",
      year: "2024"
    }
  },
  {
    _id: "art-5",
    title: "Monolithic Geometry No. 7",
    description: "Bold structural minimalism contrasting raw obsidian charcoal with warm ivory linen negatives.",
    price: 39000,
    imageUrl: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=1200&auto=format&fit=crop",
    category: "Abstract",
    status: "Available",
    sellerName: "Devon Thorne",
    details: {
      paperQuality: "Raw Unprimed Flax Canvas",
      brushType: "Flat Hog Bristle #12",
      strokeCount: "Precision dry brush contours",
      dimensions: "48 x 48 inches",
      year: "2024"
    }
  },
  {
    _id: "art-6",
    title: "Portraits in Verdigris & Rust",
    description: "Evocative contemporary portraiture capturing contemplative gaze through weathered, oxidative textures.",
    price: 52000,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
    category: "Modern",
    status: "Available",
    sellerName: "Seraphina Quinn",
    details: {
      paperQuality: "Birch Wood Cradle Panel",
      brushType: "Mixed Synthetic & Palette Scraper",
      strokeCount: "Glazed portraiture with patina effect",
      dimensions: "32 x 44 inches",
      year: "2024"
    }
  }
];

export const ART_CATEGORIES = [
  { id: "all", name: "All Works", icon: "Sparkles" },
  { id: "Oil Painting", name: "Oil & Acrylic", icon: "Palette" },
  { id: "Abstract", name: "Abstract & Form", icon: "Shapes" },
  { id: "Modern", name: "Modern Contemporary", icon: "Layers" },
  { id: "Watercolor", name: "Watercolor & Ink", icon: "Droplets" },
  { id: "Sculpture", name: "Sculptural Objects", icon: "Box" },
];

export const FEATURED_COLLECTIONS = [
  {
    title: "The Mineral Chroma Series",
    artist: "Aria Vance",
    location: "Studio Paris",
    artworksCount: 12,
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=900&auto=format&fit=crop",
    tag: "Exhibition Highlight"
  },
  {
    title: "Architectural Silence",
    artist: "Marcus Sterling",
    location: "Berlin Atelier",
    artworksCount: 8,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=900&auto=format&fit=crop",
    tag: "Curator's Choice"
  },
  {
    title: "Organic Pigment Studies",
    artist: "Elena Rostova",
    location: "Kyoto Residency",
    artworksCount: 15,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=900&auto=format&fit=crop",
    tag: "Limited Release"
  }
];
