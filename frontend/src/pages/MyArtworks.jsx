import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Save, 
  Sparkles,
  Layers
} from "lucide-react";

const MyArtworks = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editForm, setEditForm] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const res = await fetch("/api/seller/artworks", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setArtworks(data);
      else if (res.status === 401) navigate("/signin");
    } catch (err) {
      console.error("Failed to fetch artworks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you wish to remove this artwork from your exhibition archive?")) return;

    try {
      const res = await fetch(`/api/seller/artworks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setArtworks(artworks.filter((art) => art._id !== id));
      } else if (res.status === 401) {
        navigate("/signin");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleEditToggle = (art) => {
    setEditMode(art._id);
    setEditForm(art);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/seller/artworks/${editForm._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        fetchArtworks();
        setEditMode(null);
      } else if (res.status === 401) {
        navigate("/signin");
      }
    } catch (err) {
      console.error("Edit error", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-title">
            Your Artwork Archive
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your exhibited pieces, update pricing, and monitor verification status.
          </p>
        </div>
        <span className="text-xs text-zinc-400 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10">
          {artworks.length} Artworks Registered
        </span>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-white/20 border-t-amber-300 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-zinc-400">Loading catalog...</p>
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-zinc-900/40 border border-white/10 p-8 space-y-3">
          <Palette className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-xl font-bold text-white font-serif-title">No artworks listed yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            You haven't uploaded any pieces to your exhibition portfolio. Submit your first piece to begin selling.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <motion.div
              key={art._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/60 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {/* Status badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${
                      art.status === "Sold"
                        ? "bg-red-950/80 border-red-500/30 text-red-300"
                        : "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                    }`}>
                      {art.status}
                    </span>

                    {/* Verification badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${
                      art.verificationStatus === "Approved"
                        ? "bg-zinc-900/80 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-900/80 border-amber-500/30 text-amber-300"
                    }`}>
                      {art.verificationStatus || "Pending Approval"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-xs text-zinc-400 flex justify-between">
                    <span>{art.label || "Original Work"}</span>
                    <span>Views: {art.views || 0}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif-title line-clamp-1">
                    {art.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                  <p className="text-base font-bold text-white pt-2">
                    Rs. {Number(art.price).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleEditToggle(art)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => handleDelete(art._id)}
                  className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition"
                  title="Delete artwork"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Artwork Modal */}
      <AnimatePresence>
        {editMode && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setEditMode(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#12141c] p-6 sm:p-8 text-zinc-100 shadow-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-serif-title">
                  Edit Artwork Details
                </h3>
                <button
                  onClick={() => setEditMode(null)}
                  className="p-2 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 cursor-pointer"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditMode(null)}
                    className="flex-1 py-3 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyArtworks;
