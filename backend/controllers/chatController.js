import Groq from "groq-sdk";
import Product from "../models/Product.js";

export const chatWithAI = async (req, res) => {
  try {

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message required" });
    }

    // Fetch products from DB
    const products = await Product.find();

    const availableProducts = products.filter(p => p.active);
    const outOfStockProducts = products.filter(p => !p.active);

    const productList = availableProducts.length > 0
      ? availableProducts.map(p => `${p.name} - ₹${p.basePrice}/kg`).join("\n")
      : "Currently no products available.";

    const outOfStockList = outOfStockProducts.length > 0
      ? outOfStockProducts.map(p => `${p.name}`).join("\n")
      : "None";

    const prompt = `
You are **Snehitha AI**, the official assistant for **Snehitha Products**.

ABOUT COMPANY
Snehitha Products is a leading homemade spice powder brand located in Kolathara, Calicut, Kerala, India.

PRODUCT TYPES
• Spice powders
• Masalas
• Instant food preparation items

FEATURES
• Freshly prepared
• Hygienically packed
• Traditional taste
• Safe ingredients
• Delivered across Kerala and India

CUSTOMER SUPPORT
Phone: 7012754441

DELIVERY CHARGES
₹100 for first 1 kg
₹20 for every additional kg

AVAILABLE PRODUCTS
${productList}

OUT OF STOCK PRODUCTS
${outOfStockList}

COOKING SUGGESTIONS
Chicken dishes → Chicken Masala
Fish dishes → Fish Masala
Vegetable curry → Veg Masala
General curry → Garam Masala

LANGUAGE RULES
You must understand and respond in:

• English
• Malayalam
• Manglish (Malayalam written in English letters)

IMPORTANT:
Reply in the SAME language the customer used.

Examples:

Customer: "chicken curryinu best masala ethanu?"
Reply: "Chicken curryinu best masala **Chicken Masala** aanu."

Customer: "meen curryinu masala undo?"
Reply: "Meen curryinu **Fish Masala** nannayi suit cheyyum."

Customer: "What is best masala for chicken?"
Reply: "For chicken curry I recommend Chicken Masala."

IMPORTANT RULES
1. Only recommend products from the product list.
2. Never invent products.
3. If asked unrelated questions reply:
"I can only help with Snehitha Products."

CUSTOMER QUESTION:
${userMessage}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 300
    });

    const reply = response.choices[0].message.content;

    // Detect recommended product
    let recommendedProduct = null;

    for (let product of availableProducts) {

      if (reply.toLowerCase().includes(product.name.toLowerCase())) {
        recommendedProduct = product;
        break;
      }

    }

    res.json({
      reply,
      product: recommendedProduct
    });

  } catch (error) {

    console.error("CHATBOT ERROR:", error);

    res.status(500).json({
      reply: "Snehitha AI is temporarily unavailable. Please try again."
    });

  }
};