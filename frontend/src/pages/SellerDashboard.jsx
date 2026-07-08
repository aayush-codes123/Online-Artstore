import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadArtwork from "./UploadArtwork";
import MyArtworks from "./MyArtworks";
import background from "../images/background.jpg";

const SellerDashboard = () => {
  const [activePage, setActivePage] = useState("upload");
  const [sellerName, setSellerName] = useState("");
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
      <nav className="flex justify-between items-center px-6 py-4 bg-black/60 backdrop-blur-md shadow-lg relative z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">🎨 Musemarket - Seller Dashboard</h1>
          {sellerName && (
            <span className="text-white/80 text-sm">Welcome, {sellerName}!</span>
          )}
        </div>
        <div className="flex gap-4">
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
      </nav>

      {/* Page Content */}
      <main className="py-8 px-4 relative z-10 flex items-start justify-center">
        {activePage === "upload" ? <UploadArtwork /> : <MyArtworks />}
      </main>
    </div>
  );
};

export default SellerDashboard;
