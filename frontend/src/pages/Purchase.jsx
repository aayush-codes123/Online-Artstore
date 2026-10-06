import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Palette 
} from "lucide-react";
import Navbar from "../components/Navbar";
import { CURATED_ARTWORKS } from "../data/artData";

const Purchase = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    contactNumber: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        // Fetch Artwork Details
        let foundArt = null;
        try {
          const artRes = await fetch(`/api/artworks/${artworkId}`);
          if (artRes.ok) {
            foundArt = await artRes.json();
          }
        } catch (e) {
          console.warn("Backend artwork fetch error, checking curated fallback:", e);
        }

        if (!foundArt) {
          // Check curated artworks fallback
          foundArt = CURATED_ARTWORKS.find((a) => a._id === artworkId);
        }

        if (!foundArt) {
          throw new Error("Artwork could not be located in exhibition archive.");
        }

        setArtwork(foundArt);

        // Pre-fill user profile info if logged in
        try {
          const userRes = await fetch("/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setFormData({
              fullName: userData.fullName || "",
              address: userData.address || "",
              contactNumber: userData.phoneNumber || "",
            });
          }
        } catch (e) {
          console.warn("User profile fetch failed:", e);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artworkId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment", {
      state: {
        artwork,
        formData,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-white/20 border-t-amber-300 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Loading Acquisition Archive...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md p-8 rounded-2xl bg-zinc-900 border border-white/10 space-y-4">
          <Palette className="w-10 h-10 text-zinc-500 mx-auto" />
          <h2 className="text-xl font-bold text-white font-serif-title">Artwork Unavailable</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">{error || "This artwork is not currently in the collection."}</p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Gallery</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 selection:bg-amber-400/20 selection:text-amber-200">
      <Navbar />

      <main className="pt-32 pb-24 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-white">
              <span className="w-6 h-6 rounded-full bg-white text-zinc-950 flex items-center justify-center text-xs font-bold">1</span>
              <span>Collector & Delivery</span>
            </div>
            <div className="h-[1px] flex-1 mx-4 bg-white/20" />
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 border border-white/10 flex items-center justify-center text-xs font-bold">2</span>
              <span>Payment & Escrow</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* Left Column: Artwork Showcase & Acquisition Summary */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/60 backdrop-blur-md p-6 space-y-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/5">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-amber-300">
                Original Artwork
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400 mb-1">
                Artist: <span className="text-zinc-200 font-semibold">{artwork.sellerName || artwork.seller?.fullName || "Verified Creator"}</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-serif-title">
                {artwork.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* Specifications */}
            {artwork.details && (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 space-y-2 text-xs">
                {artwork.details.paperQuality && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Medium / Surface:</span>
                    <span className="text-zinc-200 font-medium">{artwork.details.paperQuality}</span>
                  </div>
                )}
                {artwork.details.brushType && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Technique:</span>
                    <span className="text-zinc-200 font-medium">{artwork.details.brushType}</span>
                  </div>
                )}
                {artwork.details.strokeCount && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Execution:</span>
                    <span className="text-zinc-200 font-medium">{artwork.details.strokeCount}</span>
                  </div>
                )}
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Artwork Price</span>
                <span className="text-zinc-200 font-semibold">Rs. {Number(artwork.price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Museum-Grade Insured Shipping</span>
                <span className="text-emerald-400 font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Certificate of Authenticity</span>
                <span className="text-emerald-400 font-medium">Included</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Total Acquisition Amount</span>
                <span>Rs. {Number(artwork.price).toLocaleString()}</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="space-y-2 pt-2 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>100% Verified Authenticity Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-300" />
                <span>14-day collector satisfaction inspection period</span>
              </div>
            </div>
          </div>

          {/* Right Column: Collector Delivery Form */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-md p-8 space-y-6">
            <div>
              <span className="text-amber-300 text-xs font-bold uppercase tracking-[0.2em]">Step 1 of 2</span>
              <h3 className="text-2xl font-bold text-white font-serif-title mt-1">
                Collector Shipping Information
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Please enter the exact destination for climate-safe archival courier delivery.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Collector Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Archival Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street address, apartment/suite, city, postal code"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Courier Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    placeholder="Direct contact for delivery confirmation"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 flex items-start gap-3 text-xs text-zinc-400">
                <Truck className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <p>
                  Artwork is packaged with acid-free glassine, corner reinforcements, and sealed in an archival crate. Fully insured during transit.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-white text-zinc-950 font-bold text-sm transition hover:bg-zinc-200 active:scale-95 shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Secure Payment</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Purchase;
