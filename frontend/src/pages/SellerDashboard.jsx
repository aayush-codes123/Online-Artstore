import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Upload, 
  Layers, 
  LogOut, 
  User, 
  Compass, 
  Menu, 
  X,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import UploadArtwork from "./UploadArtwork";
import MyArtworks from "./MyArtworks";

const SellerDashboard = () => {
  const [activePage, setActivePage] = useState("upload");
  const [sellerName, setSellerName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setSellerName(data.fullName || data.username);
        else if (res.status === 401) navigate("/signin");
      } catch (err) {
        console.error("Failed to fetch seller info", err);
      }
    };

    fetchSellerInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 selection:bg-amber-400/20 selection:text-amber-200">
      {/* Studio Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0e1017]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 border border-white/15 text-amber-300">
                <Palette className="w-5 h-5" />
              </span>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-widest text-white font-serif-title">
                  MUSEMARKET
                </span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-sans -mt-0.5">
                  Artist Studio Portal
                </span>
              </div>
            </Link>

            {sellerName && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-zinc-400">Resident Artist:</span>
                <span className="font-semibold text-white">{sellerName}</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2 p-1 rounded-full bg-zinc-900/80 border border-white/10 text-xs">
            <button
              onClick={() => setActivePage("upload")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                activePage === "upload"
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "text-zinc-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Submit Artwork</span>
            </button>
            <button
              onClick={() => setActivePage("myartworks")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                activePage === "myartworks"
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "text-zinc-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Catalog & Archive</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/explore"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>View Gallery</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-[#0e1017] px-6 py-4 space-y-2"
            >
              <button
                onClick={() => {
                  setActivePage("upload");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium ${
                  activePage === "upload" ? "bg-white text-zinc-950 font-bold" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Submit Artwork</span>
              </button>
              <button
                onClick={() => {
                  setActivePage("myartworks");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium ${
                  activePage === "myartworks" ? "bg-white text-zinc-950 font-bold" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Catalog & Archive</span>
              </button>
              <Link
                to="/explore"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/5"
              >
                <Compass className="w-4 h-4" />
                <span>Public Gallery</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-red-300 bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Studio Workspace */}
      <main className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {activePage === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <UploadArtwork />
            </motion.div>
          ) : (
            <motion.div
              key="myartworks"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <MyArtworks />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SellerDashboard;
