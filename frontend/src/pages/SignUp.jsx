import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Palette, 
  ArrowLeft, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";

export const SignUp = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    phone: "",
    age: "24",
    category: "Modern",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isSeller && (parseInt(formData.age) < 18 || parseInt(formData.age) > 50)) {
      setError("Collectors must be between 18 and 50 years old to register.");
      return;
    }

    if (!/^98\d{8}$/.test(formData.phone)) {
      setError("Contact number must be 10 digits starting with 98 (e.g., 98XXXXXXXX).");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(formData.username)) {
      setError("Username must contain letters only with no spaces or numbers.");
      return;
    }

    setLoading(true);

    const payload = {
      fullName: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      phoneNumber: formData.phone,
      role: isSeller ? "seller" : "buyer",
      ...(isSeller && { artStyle: formData.category }),
      ...(!isSeller && { age: parseInt(formData.age) }),
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setError(data.message || "Registration failed. Please check your details.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex flex-col lg:flex-row">
      {/* Left Column: Visual Atelier Showcase */}
      <div className="relative hidden lg:flex lg:w-5/12 min-h-screen overflow-hidden bg-zinc-950 items-end p-12">
        <img
          src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=1400&auto=format&fit=crop"
          alt="Artist Atelier MuseMarket"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/40 to-black/20" />

        <div className="relative z-10 space-y-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curator Network</span>
          </div>

          <h3 className="text-2xl font-bold text-white font-serif-title leading-snug">
            {isSeller
              ? "Exhibit in Premier Digital Salons with 95% Creator Royalties."
              : "Acquire Museum-Grade Originals with Guaranteed Provenance."}
          </h3>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {isSeller
              ? "Join an exclusive community of sculptors, painters, and mixed media creators reaching patrons globally."
              : "Discover curated seasonal drops, certified authentic certificates, and climate-safe courier shipping."}
          </p>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 max-w-2xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
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

        {/* Center Form */}
        <div className="my-auto space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white font-serif-title">
              Create an Account
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select your membership type to begin your journey with MuseMarket.
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsSeller(false)}
              className={`py-2.5 rounded-xl transition-all duration-200 ${
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
              className={`py-2.5 rounded-xl transition-all duration-200 ${
                isSeller
                  ? "bg-white text-zinc-950 shadow-md font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Artist / Seller
            </button>
          </div>

          {/* Alert messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-100">Registration Successful!</p>
                <p className="text-emerald-300">Redirecting to sign in...</p>
              </div>
            </motion.div>
          )}

          {/* Inputs Grid */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Username (Letters Only)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. johndoe"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Phone (Starts 98..., 10 digits)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Shipping / Studio Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="City, Province, Country"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>

              {isSeller ? (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Primary Art Style / Medium
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 transition-all cursor-pointer"
                    >
                      <option value="Modern">Modern & Contemporary</option>
                      <option value="Oil Painting">Oil & Acrylic</option>
                      <option value="Abstract">Abstract Expressionism</option>
                      <option value="Watercolor">Watercolor & Ink</option>
                      <option value="Sculpture">Sculptural Objects</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Age (18 - 50)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="number"
                      name="age"
                      min="18"
                      max="50"
                      required
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-full bg-white text-zinc-950 font-bold text-sm transition hover:bg-zinc-200 active:scale-95 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Creating Account..." : `Register as ${isSeller ? "Artist" : "Collector"}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-zinc-400">
            <span>Already have an account? </span>
            <Link to="/signin" className="font-semibold text-white hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted data protection & verified gallery protocols</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
