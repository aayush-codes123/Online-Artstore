import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UploadArtwork = () => {
  const navigate = useNavigate();
  const [sellerName, setSellerName] = useState("");
  const [artwork, setArtwork] = useState({
    title: "",
    description: "",
    price: "",
    label: "",
    status: "Available",
    image: null,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
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
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtwork({ ...artwork, [name]: value });
  };

  const handleImageChange = (e) => {
    setArtwork({ ...artwork, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Calculate final price with 5% commission
    const basePrice = parseFloat(artwork.price);
    const finalPrice = basePrice * 1.05;

    // Append all fields
    formData.append('title', artwork.title);
    formData.append('description', artwork.description);
    formData.append('price', finalPrice); // Send final price
    formData.append('label', artwork.label);
    formData.append('status', artwork.status);
    formData.append('paperQuality', artwork.paperQuality || '');
    formData.append('brushType', artwork.brushType || '');
    formData.append('strokeCount', artwork.strokeCount || '');
    if (artwork.image) formData.append('image', artwork.image);

    try {
      const res = await fetch("http://localhost:5000/api/seller/artworks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Artwork uploaded successfully!");
        setArtwork({
          title: "",
          description: "",
          price: "",
          label: "",
          status: "Available",
          image: null,
        });
        // Reset file input
        document.querySelector('input[type="file"]').value = "";
      } else if (res.status === 401) {
        navigate("/signin");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-white/30 shadow-2xl max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-white text-3xl font-extrabold text-center mb-6">
        Upload New Artwork
      </h2>
      <p className="text-white/70 text-center mb-6">
        Welcome, {sellerName || "Seller"}!
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/90 font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              required
              value={artwork.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Artwork title"
            />
          </div>
          <div>
            <label className="block text-white/90 font-medium mb-2">Label/Category</label>
            <input
              type="text"
              name="label"
              required
              value={artwork.label}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="e.g., Abstract, Portrait"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/90 font-medium mb-2">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            value={artwork.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            placeholder="Describe your artwork..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/90 font-medium mb-2">Paper Quality</label>
            <input type="text" name="paperQuality" value={artwork.paperQuality} onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="e.g. 300gsm Cold Press" />
          </div>
          <div>
             <label className="block text-white/90 font-medium mb-2">Brush Type</label>
             <input type="text" name="brushType" value={artwork.brushType} onChange={handleChange}
               className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 transition"
               placeholder="e.g. Synthetic, Sable" />
          </div>
        </div>

        <div>
             <label className="block text-white/90 font-medium mb-2">Stroke Count / Details</label>
             <input type="text" name="strokeCount" value={artwork.strokeCount} onChange={handleChange}
               className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 transition"
               placeholder="Specific strokes or technique details" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/90 font-medium mb-2">Your Price (Rs.)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              value={artwork.price}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Enter price"
            />
            {artwork.price && (
                <div className="mt-2 text-sm text-gray-300">
                    <p>Commission (5%): Rs. {(artwork.price * 0.05).toFixed(2)}</p>
                    <p className="font-bold text-white">Listing Price: Rs. {(artwork.price * 1.05).toFixed(2)}</p>
                </div>
            )}
          </div>
          <div>
            <label className="block text-white/90 font-medium mb-2">Status</label>
            <select
              name="status"
              value={artwork.status}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <option className="bg-gray-800" value="Available">
                Available
              </option>
              <option className="bg-gray-800" value="Sold">
                Sold
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white/90 font-medium mb-2">Artwork Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 bg-white/20 text-white rounded-lg outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-700 transition"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition duration-300"
        >
          Upload Artwork
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UploadArtwork;
