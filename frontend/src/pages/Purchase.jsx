import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        // Fetch Artwork Details
        const artRes = await fetch(`/api/artworks/${artworkId}`);
        if (!artRes.ok) throw new Error("Failed to load artwork");
        const artData = await artRes.json();
        setArtwork(artData);

        // Fetch User Profile for Pre-filling
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
    // Navigate to Payment page with details
    navigate("/payment", {
      state: {
        artwork,
        formData
      }
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!artwork) return <div className="min-h-screen flex items-center justify-center text-red-500">Artwork not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row"
      >
        {/* Artwork Preview Section */}
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6">
            <h2 className="text-3xl font-bold">{artwork.title}</h2>
            <p className="text-gray-300 mt-2 line-clamp-2">{artwork.description}</p>

            {/* Artwork Details */}
            {artwork.details && (
              <div className="mt-3 text-sm text-gray-300 space-y-1">
                {artwork.details.paperQuality && <p><span className="text-gray-400">Paper:</span> {artwork.details.paperQuality}</p>}
                {artwork.details.brushType && <p><span className="text-gray-400">Brush:</span> {artwork.details.brushType}</p>}
                {artwork.details.strokeCount && <p><span className="text-gray-400">Details:</span> {artwork.details.strokeCount}</p>}
              </div>
            )}

            <p className="text-2xl font-semibold text-purple-400 mt-4">Rs. {artwork.price}</p>
          </div>
        </div>

        {/* Purchase Form Section */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-purple-300">Complete Your Purchase</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Shipping Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="Enter delivery address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="Enter phone number"
              />
            </div>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                <span>Next Step</span>
                <span className="text-purple-400 font-semibold">Payment</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition duration-300"
              >
                Proceed to Payment
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Purchase;
