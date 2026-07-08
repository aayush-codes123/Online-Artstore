import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import background from "../images/background.jpg";

export const SignIn = () => {
  const [isSeller, setIsSeller] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for cookies if using sessions
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token); // Optional: store JWT
        if (data.user.role === "seller") {
          navigate("/sellerdashboard");
        } else if (data.user.role === "admin") {
          navigate("/admindashboard");
        } else {
          navigate("/explore");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-indigo-600/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      />
<div className="absolute top-0 left-0 w-full bg-black/40 backdrop-blur-sm z-50">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <a
      href="/"
      className="text-white text-2xl font-bold hover:text-purple-300 transition"
    >
      🎨 Musemarket
    </a>
    <a
      href="/"
      className="text-white font-medium hover:text-purple-300 transition"
    >
      Home
    </a>
  </div>
  </div>
        {/* Toggle Buttons */}
        <motion.div
          className="flex gap-6 mb-8 z-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <button
            onClick={() => setIsSeller(true)}
            className={`text-xl font-semibold px-6 py-3 rounded-full backdrop-blur-lg transition duration-300 ${
              isSeller
                ? "text-white bg-purple-700 shadow-xl"
                : "text-gray-200 hover:text-white hover:bg-purple-500/30"
            }`}
          >
            For Seller
          </button>
          <button
            onClick={() => setIsSeller(false)}
            className={`text-xl font-semibold px-6 py-3 rounded-full backdrop-blur-lg transition duration-300 ${
              !isSeller
                ? "text-white bg-purple-700 shadow-xl"
                : "text-gray-200 hover:text-white hover:bg-purple-500/30"
            }`}
          >
            For Buyer
          </button>
        </motion.div>

        {/* Login Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSeller ? "seller" : "buyer"}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-white/30 shadow-2xl w-full max-w-md z-10"
          >
            <motion.h2
              className="text-white text-3xl font-extrabold text-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isSeller ? "Seller Sign In" : "Buyer Sign In"}
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-lg font-medium text-white/80 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                  placeholder="Enter your username"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-lg font-medium text-white/80 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                  placeholder="Enter your password"
                  required
                />
              </motion.div>

              {error && (
                <motion.p
                  className="text-red-300 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-white/20 text-white py-3 rounded-xl hover:bg-purple-600/40 transition shadow-md mt-2"
              >
                Sign In
              </motion.button>
            </form>

            <motion.p
              className="text-white/70 text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Don’t have an account?{" "}
              <a href="/signup" className="underline hover:text-white">
                Sign up
              </a>
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
  );
};

export default SignIn;
