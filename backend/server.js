import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // ✅ Chatbot route

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================

// Enable CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Serve uploaded images (VERY IMPORTANT)
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

// Health check
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Product routes
app.use("/api/products", productRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Chatbot route (Groq API)
app.use("/api/chat", chatRoutes);

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