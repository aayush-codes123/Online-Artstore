import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Palette, 
  Award, 
  ChevronRight,
  Eye,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import Navbar from "../components/Navbar";
import { CURATED_ARTWORKS, FEATURED_COLLECTIONS } from "../data/artData";

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  useEffect(() => {
    // Track visitor
    fetch("/api/track-visitor", { method: "POST" }).catch(() => {});

    // Fetch artworks from backend
    fetch("/api/artworks/explore")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setArtworks(data.slice(0, 6));
        } else {
          setArtworks(CURATED_ARTWORKS);
        }
      })
      .catch((err) => {
        console.warn("Using curated fallback collection:", err);
        setArtworks(CURATED_ARTWORKS);
      })
      .finally(() => {
        setLoadingArtworks(false);
      });
  }, []);

  const displayArtworks = artworks.length > 0 ? artworks : CURATED_ARTWORKS;

  return (
    <div className="relative min-h-screen bg-[#0b0c10] text-zinc-100 selection:bg-amber-400/20 selection:text-amber-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] pt-32 pb-20 px-6 sm:px-8 lg:px-12 flex flex-col justify-center overflow-hidden">
        {/* Subtle background atmospheric texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 filter brightness-50 pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1920&auto=format&fit=crop')"
          }}
        />
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c10]/80 via-[#0b0c10]/70 to-[#0b0c10]" />
        
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autumn Salon Exhibition 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] font-serif-title">
              Where Exceptional Art Finds Its Collectors
            </h1>

            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed font-light">
              Acquire verified original paintings, museum-grade canvases, and modern sculptural works directly from acclaimed independent artists worldwide.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/explore"
                className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-zinc-950 transition-all duration-300 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/10 active:scale-95"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-zinc-900/60 px-7 py-4 text-sm font-semibold text-zinc-200 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:text-white"
              >
                <Palette className="w-4 h-4 text-amber-300" />
                <span>Apply as Artist</span>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-serif-title">450+</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Verified Artists</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-serif-title">100%</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Authenticated</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-serif-title">0%</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Hidden Fees</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Featured Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-zinc-900/80 shadow-2xl shadow-black/80 group">
              <div className="relative h-[440px] sm:h-[480px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop"
                  alt="Featured Artpiece"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Badge top */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Curator Spotlight</span>
                </div>

                {/* Bottom card details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <span>Aria Vance</span>
                    <span>•</span>
                    <span className="text-amber-300">Belgian Linen Impasto</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif-title">
                    Ethereal Solitude in Ultramarine
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-white">
                      Rs. 32,000
                    </span>
                    <Link
                      to="/explore"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-zinc-950 text-xs font-bold transition hover:bg-zinc-200"
                    >
                      <span>View Gallery</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif-title">
              Featured Artworks
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white group"
          >
            <span>Explore All 200+ Artworks</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArtworks.map((art, idx) => (
            <motion.div
              key={art._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/60 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-black/70 flex flex-col"
            >
              {/* Image Container */}
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

                {/* Status Badge */}
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

                {/* Quick overlay link */}
                <Link
                  to={art.status === "Sold" ? "/explore" : `/purchase/${art._id}`}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                >
                  <span className="px-5 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    {art.status === "Sold" ? "View Details" : "Acquire Original"}
                  </span>
                </Link>
              </div>

              {/* Card Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                    <span>{art.sellerName || art.seller?.fullName || "Featured Artist"}</span>
                    {art.category && (
                      <span className="text-zinc-500">{art.category}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif-title line-clamp-1 group-hover:text-amber-200 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    {art.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Price</span>
                    <span className="text-base font-bold text-white">
                      Rs. {Number(art.price).toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={art.status === "Sold" ? "/explore" : `/purchase/${art._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white"
                  >
                    <span>View Work</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Collections Exhibition Showcase */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-zinc-950/70 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
              Seasonal Curator Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif-title mt-2">
              Featured Exhibitions
            </h2>
            <p className="text-zinc-400 text-sm mt-3">
              Explore themed series curated by contemporary galleries and resident artists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_COLLECTIONS.map((col, idx) => (
              <div 
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/60"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zinc-950/70 border border-white/15 text-[11px] font-semibold text-amber-300">
                    {col.tag}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs text-zinc-300">{col.artist} — {col.location}</p>
                    <h3 className="text-xl font-bold text-white font-serif-title mt-0.5">
                      {col.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between border-t border-white/5">
                  <span className="text-xs text-zinc-400">{col.artworksCount} Works Catalogued</span>
                  <Link
                    to="/explore"
                    className="text-xs font-semibold text-white flex items-center gap-1 group-hover:text-amber-300 transition-colors"
                  >
                    <span>Browse Collection</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The MuseMarket Standard (Why Choose Us) */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
            Trust & Integrity
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif-title mt-2">
            The MuseMarket Standard
          </h2>
          <p className="text-zinc-400 text-base mt-3">
            Every transaction is safeguarded by strict authentication, insured courier logistics, and collector guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif-title">
              Certificate of Authenticity
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every acquired original arrives accompanied by an artist-signed certificate detailing provenance, materials, medium, and catalog archive serial.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif-title">
              Museum-Grade Logistics
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Specialized art handling using acid-free glassine, reinforced corner guards, and rigid custom crates with full transit damage protection.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif-title">
              Artist-First Fair Trade
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Our 95% creator payout model ensures fine artists receive direct patronage, while buyers benefit from transparent, direct gallery pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Artist Invitation Callout */}
      <section className="relative py-24 px-6 sm:px-8 lg:px-12 overflow-hidden border-t border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 filter brightness-50"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=1920&auto=format&fit=crop')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-[#0b0c10]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
            Call for Independent Artists
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-serif-title">
            Exhibit Your Artwork to Collectors Worldwide
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of painters, sculptors, and mixed media creators showcasing their works in MuseMarket’s curated digital gallery.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 hover:shadow-xl active:scale-95"
            >
              <span>Apply for Artist Representation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-zinc-900/60 px-7 py-4 text-sm font-semibold text-zinc-200 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-white/10 bg-[#08090d] py-16 px-6 sm:px-8 lg:px-12 text-zinc-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 border border-white/15 text-amber-300 text-sm">
                <Palette className="w-4 h-4" />
              </span>
              <span className="text-lg font-bold text-white font-serif-title tracking-wider">
                MUSEMARKET
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Curated original art marketplace connecting discerning patrons with visionary independent creators.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Gallery</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore" className="hover:text-white transition">All Artworks</Link></li>
              <li><Link to="/explore" className="hover:text-white transition">Oil & Acrylic</Link></li>
              <li><Link to="/explore" className="hover:text-white transition">Modernist Works</Link></li>
              <li><Link to="/explore" className="hover:text-white transition">Abstract Studies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Artists</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/signup" className="hover:text-white transition">Seller Application</Link></li>
              <li><Link to="/signin" className="hover:text-white transition">Artist Studio Login</Link></li>
              <li><Link to="/explore" className="hover:text-white transition">Exhibition Guidelines</Link></li>
              <li><span className="text-zinc-500">Commission Rates (95/5)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Collector Guarantee</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Certified authentic, insured courier transport, and 14-day collector inspection period.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Escrow Secure Payments</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} MuseMarket Archive. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Terms of Acquisition</span>
            <span>Privacy Policy</span>
            <span>Provenance Archive</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
