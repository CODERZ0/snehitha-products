import Product from "../models/Product.js";

// ================= GET ALL PRODUCTS =================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// ================= ADD PRODUCT (WITH JPG UPLOAD) =================
export const addProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "JPG image is required" });
    }

    const { name, category, basePrice } = req.body;

    const product = new Product({
      name,
      category,
      basePrice: Number(basePrice), // force number
      image: req.file.filename,
      active: true,
    });

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const updateData = {};

    // Update price safely
    if (req.body.basePrice !== undefined) {
      updateData.basePrice = Number(req.body.basePrice);
    }

    // Update active safely
    if (req.body.active !== undefined) {
      updateData.active = Boolean(req.body.active);
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

// ================= SEED PRODUCTS =================
export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany();

    const products = [
      { name: "Chicken Masala", category: "masalas", basePrice: 400, image: "chicken-masala.jpg", active: true },
      { name: "Fish Masala", category: "masalas", basePrice: 380, image: "fish-masala.jpg", active: true },
      { name: "Garam Masala", category: "masalas", basePrice: 450, image: "garam-masala.jpg", active: true },
      { name: "Meat Masala", category: "masalas", basePrice: 420, image: "meat-masala.jpg", active: true },
      { name: "Veg Masala", category: "masalas", basePrice: 350, image: "veg-masala.jpg", active: true },

      { name: "Coriander Powder", category: "powders", basePrice: 300, image: "coriander-powder.jpg", active: true },
      { name: "Custom Red Chilli Powder", category: "powders", basePrice: 500, image: "custom-red-chilli.jpg", active: true },
      { name: "Kashmiri Red Chilli", category: "powders", basePrice: 520, image: "kashmiri-red-chilli.jpg", active: true },
      { name: "Rasam Powder", category: "powders", basePrice: 280, image: "rasam-powder.jpg", active: true },
      { name: "Red Chilli Powder", category: "powders", basePrice: 480, image: "red-chilli-powder.jpg", active: true },
      { name: "Roasted Coriander Powder", category: "powders", basePrice: 320, image: "roasted-coriander.jpg", active: true },
      { name: "Sambar Powder", category: "powders", basePrice: 300, image: "sambar-powder.jpg", active: true },
      { name: "Turmeric Powder", category: "powders", basePrice: 260, image: "turmeric-powder.jpg", active: true },

      { name: "Coconut Arave", category: "other", basePrice: 600, image: "arave-other.jpg", active: true }
    ];

    await Product.insertMany(products);

    res.json({ message: "Products Seeded Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Seeding failed" });
  }
};