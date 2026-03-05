import Product from "../models/Product.js";

// ================= GET ALL PRODUCTS =================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error.message);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// ================= ADD PRODUCT =================
export const addProduct = async (req, res) => {
  try {
    // 1. Log incoming data to see what Multer processed
    console.log("--- NEW PRODUCT ATTEMPT ---");
    console.log("Body Data:", req.body);
    console.log("File Data:", req.file ? `Received: ${req.file.originalname}` : "NO FILE RECEIVED");

    // 2. Validate file existence
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const { name, category, basePrice } = req.body;

    // 3. Validate required fields
    if (!name || !category || !basePrice) {
      return res.status(400).json({ message: "Missing product details (name, category, or price)" });
    }

    // 4. Create and Save Product
    const product = new Product({
      name,
      category,
      basePrice: Number(basePrice),
      image: req.file.path, // Cloudinary URL provided by Multer-Storage-Cloudinary
      active: true
    });

    await product.save();
    console.log("✅ Product Saved Successfully:", product.name);
    res.status(201).json(product);

  } catch (error) {
    // FIX: Detailed logging to reveal the true error in Render logs
    console.error("❌ ADD PRODUCT CRASHED:");
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
    
    // If it's a Cloudinary error, it will be hidden inside the error object
    if (error.cloudinary) {
      console.error("Cloudinary Specific Error:", JSON.stringify(error.cloudinary, null, 2));
    }

    res.status(500).json({ 
      message: "Server Error: Could not add product", 
      error: error.message 
    });
  }
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.basePrice !== undefined) updateData.basePrice = Number(req.body.basePrice);
    if (req.body.active !== undefined) updateData.active = Boolean(req.body.active);
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.category) updateData.category = req.body.category;

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error.message);
    res.status(500).json({ message: "Error updating product" });
  }
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error.message);
    res.status(500).json({ message: "Error deleting product" });
  }
};

// ================= SEED PRODUCTS =================
export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany();

    const products = [
      { name: "Chicken Masala", category: "masalas", basePrice: 400, image: "https://via.placeholder.com/150", active: true },
      { name: "Fish Masala", category: "masalas", basePrice: 380, image: "https://via.placeholder.com/150", active: true },
      { name: "Garam Masala", category: "masalas", basePrice: 450, image: "https://via.placeholder.com/150", active: true },
      { name: "Coriander Powder", category: "powders", basePrice: 300, image: "https://via.placeholder.com/150", active: true },
      { name: "Turmeric Powder", category: "powders", basePrice: 260, image: "https://via.placeholder.com/150", active: true }
    ];

    await Product.insertMany(products);
    res.status(200).json({ message: "Products seeded successfully" });
  } catch (error) {
    console.error("SEED PRODUCTS ERROR:", error.message);
    res.status(500).json({ message: "Seeding failed" });
  }
};