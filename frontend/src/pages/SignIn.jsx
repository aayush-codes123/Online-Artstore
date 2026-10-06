import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  ArrowLeft, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export const SignIn = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        if (data.user?.role === "seller") {
          navigate("/sellerdashboard");
        } else if (data.user?.role === "admin") {
          navigate("/admindashboard");
        } else {
          navigate("/explore");
        }
      } else {
        setError(data.message || "Invalid credentials. Please verify and try again.");
      }
    } catch (err) {
      setError("Unable to connect to service. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex flex-col lg:flex-row">
      {/* Left Column: Fine Art Editorial Visual Showcase (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen overflow-hidden bg-zinc-950 items-end p-12">
        <img
          src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1400&auto=format&fit=crop"
          alt="MuseMarket Gallery Artwork"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-105"
        />
        {/* Deep elegant vignette (No tacky linear color gradients) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/40 to-black/20" />

        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn Salon Archive</span>
          </div>

          <blockquote className="text-2xl font-medium text-white font-serif-title leading-snug">
            "Art enables us to find ourselves and lose ourselves at the same time."
          </blockquote>
          
          <div className="flex items-center gap-3 pt-2 text-xs text-zinc-300">
            <span className="font-semibold text-white">Thomas Merton</span>
            <span>•</span>
            <span>Permanent Archive Collection</span>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gallery</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 border border-white/15 text-amber-300">
              <Palette className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold tracking-widest text-white font-serif-title">
              MUSEMARKET
            </span>
          </Link>
        </div>

        {/* Center Content */}
        <div className="my-auto space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif-title">
              Welcome Back
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Sign in to manage your collection or access your artist studio.
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsSeller(false)}
              className={`py-3 rounded-xl transition-all duration-200 ${
                !isSeller
                  ? "bg-white text-zinc-950 shadow-md font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Collector / Buyer
            </button>
            <button
              type="button"
              onClick={() => setIsSeller(true)}
              className={`py-3 rounded-xl transition-all duration-200 ${
                isSeller
                  ? "bg-white text-zinc-950 shadow-md font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Artist / Seller
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-full bg-white text-zinc-950 font-bold text-sm transition hover:bg-zinc-200 active:scale-95 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating..." : `Sign In as ${isSeller ? "Artist" : "Collector"}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-zinc-400">
            <span>New to MuseMarket? </span>
            <Link to="/signup" className="font-semibold text-white hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted authentication & verified archive protection</span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
