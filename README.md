# 🎨 Musemarket - Online Art Marketplace

**Musemarket** is a premier online platform connecting art lovers with talented creators. It serves as a digital bridge where artists (Sellers) can showcase their masterpieces—ranging from Sketches and Modern Art to Abstract and Realism—and art enthusiasts (Buyers) can discover and purchase unique works.

## 🚀 Features

### 👤 Role-Based Access
- **Buyers**: Browse collections, search for art, add to cart, and purchase securely.
- **Sellers**: Create profiles, upload artwork, manage inventory, and track sales via a dashboard.
- **Admin**: Comprehensive analytics dashboard to monitor users, artworks, and platform activity.

### 🔐 Authentication & Security
- Secure **Signup/Login** with JWT (JSON Web Tokens).
- **Role-based Middleware** protecting sensitive routes.
- Password encryption using `bcryptjs`.

### 🛍️ E-Commerce Functionality
- **Shopping Cart**: Add/remove items with real-time updates.
- **Checkout**: Integrated with **Stripe** for secure payment processing.
- **Order Management**: Buyers can view order history; Sellers can track sold items.

### 🖼️ Content Management
- **Image Uploads**: Seamless integration with **Cloudinary** for high-quality artwork storage.
- **Categories**: Filter art by styles like Modern, Abstract, Realism, and more.
- **Search**: Find artworks by name or keyword.

### 📊 Analytics
- **Admin Dashboard**: Visual charts and metrics powered by **Recharts**.
- **Seller Stats**: Track earnings and inventory status.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://greensock.com/gsap/)
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
- **Authentication**: JWT & Passport
- **Image Hosting**: Cloudinary (persistent cloud hosting for Vercel & production)
- **Payments**: Stripe API
- **Email**: Nodemailer

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed on your machine.
- MongoDB instance (local or Atlas).
- Cloudinary Account (Cloud Name, API Key, API Secret).
- Stripe Account.

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend` folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `frontend` folder (if utilizing env vars for API URL):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📄 API Documentation (Brief)

### Auth
- `POST /api/auth/signup` - Register a new user (Buyer/Seller).
- `POST /api/auth/login` - Login and receive JWT.

### Artworks
- `GET /api/artworks` - Fetch seller's artworks.
- `GET /api/artworks/explore` - Fetch public approved artworks.
- `POST /api/seller/artworks` or `POST /api/artworks` - Upload new artwork with image directly to Cloudinary (Seller only).
- `PUT /api/artworks/:id` - Update artwork details / image (Seller only).
- `DELETE /api/artworks/:id` - Delete artwork and remove asset from Cloudinary (Seller only).

### Cloudinary & Uploads
- `GET /api/cloudinary/config` (or `/api/cloudinary/status`) - Check if Cloudinary credentials are active.
- `POST /api/cloudinary/upload` (or `/api/upload`) - Upload an image via `multipart/form-data` (`image` or `file` field). Returns CDN URL and public_id.
- `POST /api/cloudinary/upload-url` - Upload image via base64 or remote URL (Auth required).
- `GET /api/cloudinary/signature` - Get signed timestamp and signature for direct client-to-Cloudinary uploads (Auth required).
- `DELETE /api/cloudinary/:public_id` - Delete image from Cloudinary by public ID (Auth required).

### Orders
- `POST /api/orders` - Create a new order (Checkout).
- `GET /api/orders/my-orders` - Get buyer's order history.

---

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

**Made with ❤️ by Aayush**
