import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MyArtworks = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
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
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;

    try {
      const res = await fetch(`/api/seller/artworks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setArtworks(artworks.filter((art) => art._id !== id));
        alert("Artwork deleted successfully!");
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
        alert("Artwork updated successfully!");
      } else if (res.status === 401) {
        navigate("/signin");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("Edit error", err);
    }
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-white/30 shadow-2xl max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-white text-3xl font-bold mb-6 text-center">
        My Artworks
      </h2>

      {artworks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">No artworks uploaded yet.</p>
          <p className="text-white/50 text-sm mt-2">Start by uploading your first artwork!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <motion.div
              key={art._id}
              className="bg-white/10 rounded-xl overflow-hidden border border-white/20 shadow-lg backdrop-blur-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {editMode === art._id ? (
                <form onSubmit={handleEditSubmit} className="p-4 space-y-3">
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows={3}
                      className="w-full p-2 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Price (Rs.)</label>
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        className="w-full p-2 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Status</label>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="w-full p-2 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-purple-500"
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
                    <label className="block text-white/80 text-sm mb-1">Label</label>
                    <input
                      type="text"
                      name="label"
                      value={editForm.label}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setEditMode(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              ) : (
                <>
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-1">{art.title}</h3>
                    <p className="text-white/70 text-sm mb-2 line-clamp-2">{art.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-purple-300 font-semibold text-lg">Rs. {art.price}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        art.status === 'Available'
                          ? 'bg-green-500/30 text-green-200'
                          : 'bg-red-500/30 text-red-200'
                      }`}>
                        {art.status}
                      </span>
                    </div>

                    {/* Verification Status Badge */}
                    <div className="mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs border ${
                            art.verificationStatus === 'Approved' ? 'border-green-500 text-green-300' :
                            art.verificationStatus === 'Rejected' ? 'border-red-500 text-red-300' :
                            'border-yellow-500 text-yellow-300'
                        }`}>
                            Approval: {art.verificationStatus || 'Pending'}
                        </span>
                    </div>

                    {art.label && (
                      <p className="text-white/50 text-xs mb-3">Category: {art.label}</p>
                    )}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditToggle(art)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(art._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyArtworks;
