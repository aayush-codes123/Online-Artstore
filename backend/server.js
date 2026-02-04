const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const artworkRoutes = require('./routes/artworkRoutes.js');
const path = require('path')
const sellerRoutes = require('./routes/sellerRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');
const createAdminUser = require('./utils/createAdminUser');

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",  // ✅ your frontend URL
    credentials: true                 // ✅ allow cookies / tokens to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/seller/artworks', artworkRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.post('/api/track-visitor', require('./controllers/statsController').trackVisitor);

const PORT = process.env.PORT || 5000;

// Start server after database connection and admin user creation
(async () => {
  try {
    await connectDB();
    await createAdminUser();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
