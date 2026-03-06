import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ ADD THIS

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================

// Enable CORS for frontend
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// ================= ROUTES =================

// Health check route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Product API routes
app.use("/api/products", productRoutes);

// Admin login route
app.use("/api/admin", adminRoutes); // ✅ ADD THIS

// ================= DATABASE CONNECTION =================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("✅ MongoDB Connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

})
.catch((error) => {

  console.error("❌ MongoDB Connection Failed:");
  console.error(error);

});