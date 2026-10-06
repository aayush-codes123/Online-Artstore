import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Compass, 
  Home as HomeIcon, 
  Upload, 
  ShieldCheck, 
  LogOut, 
  User, 
  Menu, 
  X,
  Palette
} from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOpen(false);
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-1/2 top-4 z-50 w-[calc(100%-1.5rem)] max-w-7xl -translate-x-1/2 sm:top-5 sm:w-[94%]"
    >
      <nav className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e1017]/85 px-4 py-3 text-white shadow-2xl shadow-black/60 backdrop-blur-xl sm:px-6">
        <div className="relative flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform duration-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/90 border border-white/15 text-amber-300 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-amber-300/40">
              <Palette className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-[0.2em] text-white font-serif-title sm:text-lg">
                MUSEMARKET
              </span>
              <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase -mt-1 font-sans">
                Fine Art & Archive
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/60 p-1.5 backdrop-blur-lg md:flex">
            <Link
              to="/"
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-white text-zinc-950 shadow-md font-semibold"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <HomeIcon className="w-4 h-4 opacity-80" />
              <span>Gallery</span>
            </Link>
            
            <Link
              to="/explore"
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/explore")
                  ? "bg-white text-zinc-950 shadow-md font-semibold"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Compass className="w-4 h-4 opacity-80" />
              <span>Explore Works</span>
            </Link>

            {user && (
              <Link
                to={
                  user.role === "seller"
                    ? "/sellerdashboard"
                    : user.role === "admin"
                    ? "/admindashboard"
                    : "/explore"
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive("/sellerdashboard") || isActive("/admindashboard")
                    ? "bg-white text-zinc-950 shadow-md font-semibold"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {user.role === "seller" ? (
                  <>
                    <Upload className="w-4 h-4 opacity-80" />
                    <span>Artist Studio</span>
                  </>
                ) : user.role === "admin" ? (
                  <>
                    <ShieldCheck className="w-4 h-4 opacity-80" />
                    <span>Admin Panel</span>
                  </>
                ) : null}
              </Link>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/60 border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-semibold">
                    {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium text-zinc-200">
                    {user.fullName || user.username}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-700/60 text-zinc-300 font-semibold">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-300 transition-all hover:bg-red-500/20 hover:border-red-500/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/signin"
                  className="rounded-full px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:text-white hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-100 hover:shadow-lg active:scale-95"
                >
                  <span>Join MuseMarket</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-800/60 p-2.5 text-zinc-200 transition-colors hover:bg-zinc-700/60 md:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0e1017]/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="space-y-1.5">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive("/")
                    ? "bg-white text-zinc-950 font-semibold"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Gallery Home</span>
              </Link>
              <Link
                to="/explore"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive("/explore")
                    ? "bg-white text-zinc-950 font-semibold"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Explore Artworks</span>
              </Link>

              {user && (
                <Link
                  to={
                    user.role === "seller"
                      ? "/sellerdashboard"
                      : user.role === "admin"
                      ? "/admindashboard"
                      : "/explore"
                  }
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive("/sellerdashboard") || isActive("/admindashboard")
                      ? "bg-white text-zinc-950 font-semibold"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {user.role === "seller" ? (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Artist Studio</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </>
                  )}
                </Link>
              )}

              {user ? (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between px-2 mb-3">
                    <span className="text-xs text-zinc-400">Signed in as</span>
                    <span className="text-xs font-semibold text-white">
                      {user.fullName} ({user.role})
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/15 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-xl border border-white/15 py-2.5 text-center text-sm font-medium text-white transition hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                  >
                    Join MuseMarket
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
