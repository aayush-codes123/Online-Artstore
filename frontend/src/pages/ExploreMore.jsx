import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userName }) => (
  <nav className="flex items-center justify-between px-6 py-4 bg-black bg-opacity-80 text-white shadow-md fixed w-full top-0 z-50">
    <div className="flex items-center space-x-4">
      <div className="text-3xl font-bold tracking-wide">Musemarket</div>
      {userName && (
        <div className="text-lg font-semibold ml-6">Welcome, {userName}</div>
      )}
    </div>
    <div className="space-x-4">
      {!userName ? (
        <>
          <button
            onClick={() => (window.location.href = "/signin")}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
          >
            Login
          </button>
          <button
            onClick={() => (window.location.href = "/signup")}
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
          >
            Sign Up
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/signin";
          }}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      )}
    </div>
  </nav>
);

const ExploreMore = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [userName, setUserName] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch artworks from backend
    fetch("/api/artworks/explore")
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data);
      })
      .catch((err) => console.error("Fetch artworks error:", err));

    // Check if user is logged in, get username from backend or decode token
    const token = localStorage.getItem("token");
    if (token) {
      // Example: decode token or call backend to get username
      // Here, assuming backend provides a user info endpoint
      fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((userData) => setUserName(userData.fullName))
        .catch(() => {
          localStorage.removeItem("token");
          setUserName(null);
        });
    }
  }, []);

  useEffect(() => {
    // Track page visitor
    fetch('/api/track-visitor', { method: 'POST' })
      .catch(err => console.error('Error tracking visitor', err));
  }, []);

  useEffect(() => {
    if (selectedArt) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [selectedArt]);

  const closeModal = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => setSelectedArt(null),
    });
  };

  const handleBuy = () => {
    if (!userName) {
      alert("Please login to buy artwork.");
      navigate("/signin");
      return;
    }
    navigate(`/purchase/${selectedArt._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-12 px-0">
      <Navbar userName={userName} />

      <h1 className="text-4xl font-bold text-center mb-12">Explore More Artworks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {artworks.map((art) => (
          <div
            key={art._id}
            className="bg-white rounded-lg shadow-lg cursor-pointer overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
            onClick={() => setSelectedArt(art)}
          >
            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{art.title}</h3>
                {art.status === "Sold" && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Sold
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{art.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Expanded Card */}
      {selectedArt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-black text-3xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={selectedArt.imageUrl}
              alt={selectedArt.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-bold">{selectedArt.title}</h2>
                {selectedArt.status === "Sold" && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SOLD
                  </span>
                )}
              </div>
              <p className="text-gray-700 mb-4">{selectedArt.description}</p>
              <p className="text-lg font-semibold mb-2">
                Price: <span className="text-indigo-600">Rs. {selectedArt.price}</span>
              </p>
              <p className="text-gray-800">
                Artist: <span className="font-medium">{selectedArt.sellerName || "Unknown"}</span>
              </p>
              {selectedArt.status === "Sold" ? (
                <button
                  disabled
                  className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={handleBuy}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Buy
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreMore;
