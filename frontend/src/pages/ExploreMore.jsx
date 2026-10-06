import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Sparkles, 
  X, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Palette,
  CheckCircle,
  Tag,
  SlidersHorizontal,
  Info
} from "lucide-react";
import Navbar from "../components/Navbar";
import { CURATED_ARTWORKS, ART_CATEGORIES } from "../data/artData";

const ExploreMore = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArt, setSelectedArt] = useState(null);
  const [userName, setUserName] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    // Track visitor
    fetch("/api/track-visitor", { method: "POST" }).catch(() => {});

    // Fetch artworks from backend
    fetch("/api/artworks/explore")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge with curated data or use data
          setArtworks(data);
        } else {
          setArtworks(CURATED_ARTWORKS);
        }
      })
      .catch((err) => {
        console.warn("Using curated fallback collection:", err);
        setArtworks(CURATED_ARTWORKS);
      })
      .finally(() => {
        setLoading(false);
      });

    // Check user authentication
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((userData) => setUserName(userData.fullName || userData.username))
        .catch(() => {
          localStorage.removeItem("token");
          setUserName(null);
        });
    }
  }, []);

  // Filter and sort logic
  const filteredArtworks = artworks.filter((art) => {
    // Search match
    const titleMatch = art.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = art.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const sellerMatch = (art.sellerName || art.seller?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = !searchQuery || titleMatch || descMatch || sellerMatch;

    // Category match
    const matchesCategory =
      selectedCategory === "all" ||
      art.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      art.label?.toLowerCase() === selectedCategory.toLowerCase();

    // Availability match
    const matchesAvailability =
      filterAvailability === "all" ||
      (filterAvailability === "available" && art.status !== "Sold") ||
      (filterAvailability === "sold" && art.status === "Sold");

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Sort logic
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // featured default
  });

  const handleBuy = (art) => {
    if (!userName) {
      navigate("/signin");
      return;
    }
    navigate(`/purchase/${art._id}`);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 selection:bg-amber-400/20 selection:text-amber-200">
      <Navbar />

      <main className="pt-32 pb-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-zinc-900/60 text-amber-300 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Permanent & Guest Collections</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-serif-title">
            Explore Curated Works
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg mt-3 leading-relaxed">
            Browse our catalog of verified original paintings, bespoke mixed media, and contemporary expressions.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by artwork title, artist, or style..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {/* Availability Filter */}
              <div className="flex rounded-full border border-white/10 bg-zinc-900/60 p-1 text-xs">
                <button
                  onClick={() => setFilterAvailability("all")}
                  className={`px-3 py-1.5 rounded-full transition ${
                    filterAvailability === "all" ? "bg-white text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterAvailability("available")}
                  className={`px-3 py-1.5 rounded-full transition ${
                    filterAvailability === "available" ? "bg-white text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Available
                </button>
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-900/80 border border-white/10 rounded-full px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ART_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-sm"
                    : "bg-zinc-900/40 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-400">
          <span>Showing {sortedArtworks.length} curated artworks</span>
          {searchQuery && (
            <span>Filtered by "{searchQuery}"</span>
          )}
        </div>

        {/* Artworks Grid */}
        {sortedArtworks.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 p-8">
            <Palette className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white font-serif-title">No artworks match your criteria</h3>
            <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
              Try adjusting your search terms or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setFilterAvailability("all");
              }}
              className="mt-5 px-6 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArtworks.map((art) => (
              <motion.div
                key={art._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/60 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-black/70 flex flex-col cursor-pointer"
                onClick={() => setSelectedArt(art)}
              >
                {/* Artwork Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop";
                    }}
                  />

                  {/* Status Tag */}
                  <div className="absolute top-3 right-3">
                    {art.status === "Sold" ? (
                      <span className="px-3 py-1 rounded-full bg-zinc-950/80 border border-red-500/30 text-red-300 text-xs font-semibold backdrop-blur-md">
                        Acquired
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-zinc-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Quick Inspect Hover Banner */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-5 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Inspect Artwork
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                      <span className="font-medium text-zinc-300">
                        {art.sellerName || art.seller?.fullName || "Featured Artist"}
                      </span>
                      <span className="text-zinc-500">
                        {art.category || art.label || "Original Work"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-serif-title line-clamp-1 group-hover:text-amber-200 transition-colors">
                      {art.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {art.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Acquisition</span>
                      <span className="text-base font-bold text-white">
                        Rs. {Number(art.price).toLocaleString()}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Expanded Artwork Detail Modal */}
      <AnimatePresence>
        {selectedArt && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedArt(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#12141c] shadow-2xl text-zinc-100 flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArt(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-white/10 text-zinc-300 hover:text-white hover:bg-black/80 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Artwork Visual */}
              <div className="md:w-1/2 relative min-h-[300px] md:min-h-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedArt.imageUrl}
                  alt={selectedArt.title}
                  className="w-full h-full object-cover max-h-[500px] md:max-h-full"
                />
                <div className="absolute top-4 left-4">
                  {selectedArt.status === "Sold" ? (
                    <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-bold">
                      Sold to Collector
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold">
                      Available for Acquisition
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side: Artwork Metadata & Specifications */}
              <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{selectedArt.category || selectedArt.label || "Original Work"}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-title">
                      {selectedArt.title}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      By <span className="text-zinc-200 font-semibold">{selectedArt.sellerName || selectedArt.seller?.fullName || "Resident Artist"}</span>
                    </p>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {selectedArt.description}
                  </p>

                  {/* Artwork Specifications Table */}
                  <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 space-y-2 text-xs">
                    <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Artwork Specifications</span>
                    </h4>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Paper / Canvas</span>
                      <span className="text-zinc-200 font-medium">
                        {selectedArt.details?.paperQuality || "Museum Archival Surface"}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Brush & Medium</span>
                      <span className="text-zinc-200 font-medium">
                        {selectedArt.details?.brushType || "Custom Mixed Pigments"}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Technique Details</span>
                      <span className="text-zinc-200 font-medium">
                        {selectedArt.details?.strokeCount || "Multi-pass layered study"}
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Provenance & Certificate</span>
                      <span className="text-emerald-300 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Included</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-zinc-400 block">Acquisition Price</span>
                      <span className="text-2xl font-bold text-white">
                        Rs. {Number(selectedArt.price).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">Taxes & Certificate included</span>
                  </div>

                  {selectedArt.status === "Sold" ? (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-full bg-zinc-800 text-zinc-500 font-semibold text-sm cursor-not-allowed"
                    >
                      Artwork Already Acquired
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(selectedArt)}
                      className="w-full py-3.5 rounded-full bg-white text-zinc-950 font-bold text-sm transition hover:bg-zinc-200 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Acquire Original Artwork</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreMore;
