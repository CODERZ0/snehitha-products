import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

// DEBUG CHECK
console.log("ENV TEST:", process.env.TEST_ENV);
console.log("GROQ KEY LOADED:", process.env.GROQ_API_KEY);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Root
app.get("/", (req, res) => {
  res.send("🚀 Snehitha Products Backend Running Successfully");
});

// Prevent favicon error
app.get("/favicon.ico", (req, res) => res.status(204).end());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});