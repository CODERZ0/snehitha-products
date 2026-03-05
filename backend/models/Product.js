import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["masalas", "powders", "other"],
    required: true,
  },
  basePrice: {
    type: Number, // price per kg
    required: true,
  },
  image: {
    type: String, // filename only
    required: true,
  },
  active: {
    type: Boolean,
    default: true, // true = available, false = out of stock
  },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);