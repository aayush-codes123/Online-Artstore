import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UploadArtwork from "./UploadArtwork";
import MyArtworks from "./MyArtworks";
import background from "../images/background.jpg";

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
        if (res.ok) setSellerName(data.fullName);
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
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-pink-600 to-indigo-700 opacity-90 -z-10"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-black/60 backdrop-blur-md shadow-lg relative z-20">
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">🎨 Musemarket</h1>
          {sellerName && (
            <span className="text-white/80 text-xs md:text-sm bg-white/10 px-2 py-0.5 rounded-full w-fit">
              Seller: {sellerName}
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="flex max-md:hidden gap-4">
          <button
            onClick={() => setActivePage("upload")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activePage === "upload"
                ? "bg-purple-600 shadow-lg"
                : "bg-white/20 hover:bg-white/40"
            }`}
          >
            Upload Artwork
          </button>
          <button
            onClick={() => setActivePage("myartworks")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activePage === "myartworks"
                ? "bg-purple-600 shadow-lg"
                : "bg-white/20 hover:bg-white/40"
            }`}
          >
            My Artworks
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition duration-200"
          >
            <div className="relative w-6 h-6 flex flex-col justify-around items-center">
              <span
                className={`w-6 h-0.5 bg-current rounded transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-current rounded transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-current rounded transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden absolute top-full left-0 w-full bg-black/90 border-t border-white/10 z-50 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setActivePage("upload");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-3 rounded-lg font-medium text-center transition ${
                    activePage === "upload"
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Upload Artwork
                </button>
                <button
                  onClick={() => {
                    setActivePage("myartworks");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-3 rounded-lg font-medium text-center transition ${
                    activePage === "myartworks"
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  My Artworks
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-center transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content */}
      <main className="py-8 px-4 relative z-10 flex items-start justify-center">
        {activePage === "upload" ? <UploadArtwork /> : <MyArtworks />}
      </main>
    </div>
  );
};

export default SellerDashboard;
