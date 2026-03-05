import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  seedProducts
} from "../controllers/productController.js";

// Ensure these filenames match exactly what is in your middleware folder
import upload from "../middleware/upload.js"; 
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products (Public)
 */
router.get("/", getProducts);

/**
 * @route   POST /api/products
 * @desc    Add a new product (Protected)
 * @middleware protect - Verifies Admin JWT
 * @middleware upload.single("image") - Handles Cloudinary upload
 */
router.post(
  "/",
  protect, // 1. Check if Admin is logged in
  upload.single("image"), // 2. Upload image to Cloudinary
  addProduct // 3. Save to MongoDB
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product price or status (Protected)
 */
router.put(
  "/:id",
  protect,
  updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Remove a product (Protected)
 */
router.delete(
  "/:id",
  protect,
  deleteProduct
);

/**
 * @route   GET /api/products/seed
 * @desc    Seed initial database (Protected)
 */
router.get(
  "/seed",
  protect,
  seedProducts
);

export default router;