import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed left-1/2 top-3 z-50 w-[calc(100%-1rem)] max-w-7xl -translate-x-1/2 sm:top-4 sm:w-[92%]"
    >
      <nav className="relative overflow-hidden rounded-[1.35rem] border border-white/20 bg-slate-950/45 px-3 py-3 text-white shadow-[0_16px_60px_rgba(2,6,23,0.42)] backdrop-blur-2xl backdrop-saturate-150 sm:px-5 lg:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.16),_transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10),transparent_45%,rgba(255,255,255,0.08))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.35),transparent_25%,transparent_75%,rgba(2,6,23,0.25))]" />

        <div className="relative flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-xl shadow-lg shadow-black/10 ring-1 ring-white/20">
              🎨
            </span>
            <span className="text-lg font-semibold tracking-[0.18em] text-white sm:text-xl">
              MUSEMARKET
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-950/20 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl md:flex">
            <Link
              to="/"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive("/") ? "bg-white text-slate-900 shadow-sm" : "text-white hover:bg-white/10 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive("/explore") ? "bg-white text-slate-900 shadow-sm" : "text-white hover:bg-white/10 hover:text-white"
              }`}
            >
              Explore
            </Link>
            {user && (
              <Link
                to={user.role === "seller" ? "/sellerdashboard" : user.role === "admin" ? "/admindashboard" : "/explore"}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive("/sellerdashboard") || isActive("/admindashboard")
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white hover:bg-white/15 hover:text-white"
                }`}
              >
                {user.role === "seller" ? "Seller Dashboard" : user.role === "admin" ? "Admin Dashboard" : ""}
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <span className="text-sm text-slate-300">
                  Hi, <span className="font-semibold text-white">{user.fullName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-red-400/30 bg-red-500/15 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/25"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 p-2.5 text-slate-100 transition hover:bg-white/20 md:hidden"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <div className="relative flex h-5 w-5 flex-col items-center justify-center">
              <span
                className={`h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`mt-1 h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`mt-1 h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-20 z-40 w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950/35 p-4 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 md:hidden"
          >
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition-all ${
                  isActive("/")
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/explore"
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition-all ${
                  isActive("/explore")
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Explore
              </Link>
              {user && (
                <Link
                  to={user.role === "seller" ? "/sellerdashboard" : user.role === "admin" ? "/admindashboard" : "/explore"}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-all ${
                    isActive("/sellerdashboard") || isActive("/admindashboard")
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {user.role === "seller" ? "Seller Dashboard" : user.role === "admin" ? "Admin Dashboard" : ""}
                </Link>
              )}

              {user ? (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="mb-3 text-base font-medium text-white">
                    Welcome, <span className="font-semibold text-fuchsia-400">{user.fullName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-red-500/15 px-4 py-3 text-center text-base font-medium text-red-200 transition hover:bg-red-500/25"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-xl border border-white/15 px-4 py-3 text-center text-base font-medium text-white transition hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-xl bg-white px-4 py-3 text-center text-base font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
