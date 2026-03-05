import dotenv from "dotenv";
// 1. Initialize dotenv immediately at the very top
dotenv.config(); 

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// --- Middleware ---
app.use(cors());
// Increased limit for handling image data if necessary
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Public uploads (Still available for local testing/legacy files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Snehitha Products Backend Running Successfully");
});

// Prevent favicon error
app.get("/favicon.ico", (req, res) => res.status(204).end());

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err.message));
}

// --- Dynamic Port Handling (CRITICAL FOR RENDER) ---
// Render assigns a random port via process.env.PORT. 
// If it's not found (like on localhost), it defaults to 5000.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});