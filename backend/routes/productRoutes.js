import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  seedProducts
} from "../controllers/productController.js";

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
 * @desc    Add new product (Admin only)
 */
router.post(
  "/",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {

      if (err) {
        console.error("UPLOAD ERROR:", err);
        return res.status(500).json({
          message: "Image upload failed",
          error: err.message
        });
      }

      next();
    });
  },
  addProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 */
router.put(
  "/:id",
  protect,
  updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 */
router.delete(
  "/:id",
  protect,
  deleteProduct
);

/**
 * @route   GET /api/products/seed
 * @desc    Seed database
 */
router.get(
  "/seed",
  protect,
  seedProducts
);

export default router;