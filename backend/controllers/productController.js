import Product from "../models/Product.js";


// ================= GET ALL PRODUCTS =================
export const getProducts = async (req, res) => {
  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (error) {

    console.error("❌ GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Error fetching products",
      error: error.message
    });

  }
};



// ================= ADD PRODUCT =================
export const addProduct = async (req, res) => {
  try {

    console.log("---- ADD PRODUCT REQUEST ----");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required"
      });
    }

    const { name, category, basePrice } = req.body;

    if (!name || !category || !basePrice) {
      return res.status(400).json({
        message: "Missing required fields: name, category, or basePrice"
      });
    }

    const product = new Product({
      name,
      category,
      basePrice: Number(basePrice),
      image: req.file.path, // Cloudinary URL
      active: true
    });

    const savedProduct = await product.save();

    console.log("✅ PRODUCT CREATED:", savedProduct.name);

    res.status(201).json(savedProduct);

  } catch (error) {

    console.error("❌ ADD PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error while adding product",
      error: error.message
    });

  }
};



// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {

    const updateData = {};

    if (req.body.basePrice !== undefined) {
      updateData.basePrice = Number(req.body.basePrice);
    }

    if (req.body.active !== undefined) {
      updateData.active = Boolean(req.body.active);
    }

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (req.body.category) {
      updateData.category = req.body.category;
    }

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" } // ✅ fixed mongoose warning
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(updatedProduct);

  } catch (error) {

    console.error("❌ UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Error updating product",
      error: error.message
    });

  }
};



// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {

    console.error("❌ DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Error deleting product",
      error: error.message
    });

  }
};



// ================= SEED PRODUCTS =================
export const seedProducts = async (req, res) => {
  try {

    await Product.deleteMany();

    const products = [
      {
        name: "Chicken Masala",
        category: "masalas",
        basePrice: 400,
        image: "https://via.placeholder.com/150",
        active: true
      },
      {
        name: "Fish Masala",
        category: "masalas",
        basePrice: 380,
        image: "https://via.placeholder.com/150",
        active: true
      },
      {
        name: "Garam Masala",
        category: "masalas",
        basePrice: 450,
        image: "https://via.placeholder.com/150",
        active: true
      },
      {
        name: "Coriander Powder",
        category: "powders",
        basePrice: 300,
        image: "https://via.placeholder.com/150",
        active: true
      },
      {
        name: "Turmeric Powder",
        category: "powders",
        basePrice: 260,
        image: "https://via.placeholder.com/150",
        active: true
      }
    ];

    await Product.insertMany(products);

    res.status(200).json({
      message: "Products seeded successfully"
    });

  } catch (error) {

    console.error("❌ SEED PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Seeding failed",
      error: error.message
    });

  }
};