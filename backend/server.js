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

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin fetch)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true                 // ✅ allow cookies / tokens to be sent
  })
);

// Database connection initialization flag
let dbInitialized = false;

const initApp = async () => {
  if (!dbInitialized) {
    await connectDB();
    await createAdminUser();
    dbInitialized = true;
  }
};

// Middleware to ensure database is initialized on demand (critical for Vercel Serverless Functions)
app.use(async (req, res, next) => {
  try {
    await initApp();
    next();
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ error: 'Server database initialization failed' });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/seller/artworks', artworkRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/cloudinary', require('./routes/cloudinaryRoutes'));
app.use('/api/upload', require('./routes/cloudinaryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.post('/api/track-visitor', require('./controllers/statsController').trackVisitor);

const PORT = process.env.PORT || 5000;

// Only listen when running locally in development (not under Vercel Serverless)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  initApp().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch((err) => {
    console.error('Failed to start local server:', err);
  });
}

module.exports = app;
