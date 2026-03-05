import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables for this file
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine format safely
    let fileFormat = file.mimetype.split("/")[1];
    if (fileFormat === "jpeg") fileFormat = "jpg"; // Cloudinary preference

    return {
      folder: "snehitha-products",
      format: fileFormat,
      public_id: Date.now() + "-" + file.originalname.split('.')[0]
    };
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit safety
});

export default upload;