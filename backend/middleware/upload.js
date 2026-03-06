import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ================= CLOUDINARY CONFIG =================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ================= STORAGE CONFIG =================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    // fallback format
    let format = "jpg";

    if (file.mimetype) {
      format = file.mimetype.split("/")[1];
      if (format === "jpeg") format = "jpg";
    }

    return {
      folder: "snehitha-products",
      format: format,
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`
    };
  }
});

// ================= FILE FILTER =================

const fileFilter = (req, file, cb) => {

  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }

};

// ================= MULTER SETUP =================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export default upload;