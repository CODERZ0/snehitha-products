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

// ================= PUBLIC ROUTE =================
// Anyone can view products
router.get("/", getProducts);

// ================= PROTECTED ROUTES =================
// Only logged-in admin can modify data

router.post(
  "/",
  protect,
  upload.single("image"),
  addProduct
);

router.put(
  "/:id",
  protect,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  deleteProduct
);

router.get(
  "/seed",
  protect,
  seedProducts
);

export default router;