import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["masalas", "powders", "other"],
    required: true
  },

  basePrice: {
    type: Number,
    required: true
  },

  image: {
    type: String, // Cloudinary URL
    required: true
  },

  active: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

export default mongoose.model("Product", productSchema);