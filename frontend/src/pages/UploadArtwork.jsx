import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  DollarSign, 
  FileText, 
  X,
  Info
} from "lucide-react";

const UploadArtwork = () => {
  const navigate = useNavigate();
  const [sellerName, setSellerName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [artwork, setArtwork] = useState({
    title: "",
    description: "",
    price: "",
    label: "Modern",
    status: "Available",
    paperQuality: "300gsm Cold-Pressed Cotton",
    brushType: "Oil & Palette Knife",
    strokeCount: "Textured impasto layers",
    image: null,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setSellerName(data.fullName || data.username);
        else if (res.status === 401) navigate("/signin");
      } catch (err) {
        console.error("Failed to fetch seller info", err);
      }
    };

    fetchSellerInfo();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtwork({ ...artwork, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArtwork({ ...artwork, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setArtwork({ ...artwork, image: null });
    setPreviewUrl(null);
  };

  const basePrice = parseFloat(artwork.price) || 0;
  const platformFee = Math.round(basePrice * 0.05);
  const finalPrice = basePrice + platformFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    if (!artwork.image) {
      setFeedback({ type: "error", message: "Please provide a high-resolution image of the artwork." });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", artwork.title);
    formData.append("description", artwork.description);
    formData.append("price", finalPrice);
    formData.append("label", artwork.label);
    formData.append("status", artwork.status);
    formData.append("paperQuality", artwork.paperQuality || "");
    formData.append("brushType", artwork.brushType || "");
    formData.append("strokeCount", artwork.strokeCount || "");
    formData.append("image", artwork.image);

    try {
      const res = await fetch("/api/seller/artworks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: "success",
          message: "Artwork submitted successfully! It has been submitted for verification.",
        });
        setArtwork({
          title: "",
          description: "",
          price: "",
          label: "Modern",
          status: "Available",
          paperQuality: "300gsm Cold-Pressed Cotton",
          brushType: "Oil & Palette Knife",
          strokeCount: "Textured impasto layers",
          image: null,
        });
        setPreviewUrl(null);
      } else if (res.status === 401) {
        navigate("/signin");
      } else {
        setFeedback({ type: "error", message: data.message || "Upload failed." });
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Network error occurred during submission." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-md p-6 sm:p-10 shadow-2xl">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exhibition Submission</span>
          </div>
          <h2 className="text-3xl font-bold text-white font-serif-title">
            Register New Artwork
          </h2>
          <p className="text-xs text-zinc-400">
            Submit an original physical work to MuseMarket's curated catalog.
          </p>
        </div>

        {feedback.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
              feedback.type === "success"
                ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-200"
                : "bg-red-950/60 border-red-500/30 text-red-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Visual Image Uploader with Instant Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Artwork Photography / High-Res Scan
            </label>

            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/20 aspect-[16/9] max-h-72 bg-black flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-red-600 transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-2xl p-8 cursor-pointer hover:border-amber-400/40 hover:bg-zinc-800/40 transition group">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-amber-300 group-hover:scale-110 transition">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-white mt-3">Click to select artwork photo</p>
                <p className="text-[11px] text-zinc-400 mt-1">PNG, JPG, or WEBP up to 20MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Artwork Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={artwork.title}
                onChange={handleChange}
                placeholder="e.g. Nocturne in Cerulean"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Art Style / Medium
              </label>
              <select
                name="label"
                value={artwork.label}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950/70 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 transition cursor-pointer"
              >
                <option value="Modern">Modern Contemporary</option>
                <option value="Oil Painting">Oil & Acrylic</option>
                <option value="Abstract">Abstract Expressionism</option>
                <option value="Watercolor">Watercolor & Ink</option>
                <option value="Sculpture">Sculptural Objects</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Artist's Statement & Description
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={artwork.description}
              onChange={handleChange}
              placeholder="Describe the conceptual background, inspiration, and tactile properties of the piece..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition resize-none leading-relaxed"
            />
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Paper / Canvas
              </label>
              <input
                type="text"
                name="paperQuality"
                value={artwork.paperQuality}
                onChange={handleChange}
                placeholder="e.g. 450gsm Belgian Linen"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Brushes / Tools
              </label>
              <input
                type="text"
                name="brushType"
                value={artwork.brushType}
                onChange={handleChange}
                placeholder="e.g. Sable & Palette Knife"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Stroke / Details
              </label>
              <input
                type="text"
                name="strokeCount"
                value={artwork.strokeCount}
                onChange={handleChange}
                placeholder="e.g. 12 Glazed Layers"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 transition"
              />
            </div>
          </div>

          {/* Pricing & Fee Transparency Calculator */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Your Desired Payout (Rs.)
              </label>
              <input
                type="number"
                name="price"
                required
                min="100"
                value={artwork.price}
                onChange={handleChange}
                placeholder="e.g. 35000"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-white/30 transition"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-white/5">
              <div>
                <span className="text-zinc-500 block text-[11px]">You Receive</span>
                <span className="text-white font-bold">Rs. {basePrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Platform Fee (5%)</span>
                <span className="text-amber-300 font-bold">+ Rs. {platformFee.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Catalog Price</span>
                <span className="text-emerald-400 font-bold">Rs. {finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-white text-zinc-950 font-bold text-sm transition hover:bg-zinc-200 active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{loading ? "Submitting to Archive..." : "Publish Artwork to Catalog"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadArtwork;
