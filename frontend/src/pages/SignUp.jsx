import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import background from "../images/background.jpg";

export const SignUp = () => {
  const [isSeller, setIsSeller] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    phone: "",
    age: "",
    category: "Modern",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 50) {
      alert("You must be between 18 and 50 years old to sign up.");
      return;
    }

    if (!/^98\d{8}$/.test(formData.phone)) {
      alert("Phone number should start from 98 and should be 10 digit only");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(formData.username)) {
      alert("Username should be text only and should be unique for each user and no spaces or numners");
      return;
    }

    const payload = {
      fullName: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      phoneNumber: formData.phone,
      role: isSeller ? "seller" : "buyer",
      ...(isSeller && { artStyle: formData.category }),
      ...(!isSeller && { age: parseInt(formData.age) }),
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! You can now log in.");
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      {/* Background and glow animation */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${background})` }}
      />
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-indigo-600/30 -z-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      />

      <div className="min-h-screen flex flex-col items-center justify-start pt-28 px-6 relative z-10">
        {/* Navbar */}
        <div className="absolute top-0 left-0 w-full p-5 flex justify-between items-center bg-black/40 backdrop-blur-sm z-50">
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

        {/* Toggle Buttons */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex gap-6 mb-6"
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

        {/* Form Container with AnimatePresence */}
        <div className="max-w-lg w-full" style={{ minHeight: "720px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isSeller ? "seller-form" : "buyer-form"}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/30 shadow-2xl w-full"
            >
              <motion.h2
                className="text-white text-3xl font-extrabold text-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isSeller ? "Seller Sign Up" : "Buyer Sign Up"}
              </motion.h2>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div>
                    <label className="block text-white/80">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      onChange={handleChange}
                      className="w-full p-3 mt-1 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80">Username</label>
                    <input
                      type="text"
                      name="username"
                      required
                      onChange={handleChange}
                      className="w-full p-3 mt-1 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                      placeholder="Choose a username"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div>
                    <label className="block text-white/80">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      onChange={handleChange}
                      className="w-full p-3 mt-1 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      onChange={handleChange}
                      className="w-full p-3 mt-1 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-white/80">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    onChange={handleChange}
                    className="w-full p-3 mt-1 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                    placeholder="Enter your address"
                  />
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div>
                    <label className="block text-white/80">Age</label>
                    <input
                      type="number"
                      name="age"
                      min="18"
                      required
                      onChange={handleChange}
                      className="w-full p-3 mt-1 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                      placeholder="Enter your age"
                    />
                  </div>

                  {isSeller && (
                    <div>
                      <label className="block text-white/80">Category</label>
                      <select
                        name="category"
                        required
                        onChange={handleChange}
                        className="w-full p-3 mt-1 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                      >
                        <option value="Sketches" className="bg-gray-700">Sketches</option>
                        <option value="Modern" className="bg-gray-700">Modern</option>
                        <option value="Abstract" className="bg-gray-700">Abstract</option>
                        <option value="Realism" className="bg-gray-700">Realism</option>
                        <option value="Surrealism"className="bg-gray-700">Surrealism</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-white/80">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      onChange={handleChange}
                      className="w-full p-3 mt-1 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition"
                      placeholder="Choose a password"
                    />
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-white/20 text-white py-3 rounded-xl hover:bg-purple-600/40 transition shadow-md mt-2"
                >
                  Sign Up
                </motion.button>
              </form>

              <motion.p
                className="text-white/70 text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Already have an account?{" "}
                <a href="/signin" className="underline hover:text-white">
                  Sign In
                </a>
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default SignUp;
