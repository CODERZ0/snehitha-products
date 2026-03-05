import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ChatBot from "../components/ChatBot";

const gramOptions = [
  { label: "100 g", value: 0.1 },
  { label: "200 g", value: 0.2 },
  { label: "250 g", value: 0.25 },
  { label: "500 g", value: 0.5 },
  { label: "1 kg", value: 1 },
  { label: "2 kg", value: 2 },
  { label: "3 kg", value: 3 },
  { label: "4 kg", value: 4 },
  { label: "5 kg", value: 5 },
  { label: "6 kg", value: 6 },
  { label: "7 kg", value: 7 },
  { label: "8 kg", value: 8 },
  { label: "9 kg", value: 9 },
  { label: "10 kg", value: 10 },
];

function Home() {

  const [products, setProducts] = useState([]);
  const [selectedGrams, setSelectedGrams] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProducts();
    updateCartCount();
  }, []);

  const fetchProducts = async () => {
    try {

      const res = await axios.get(`${API}/api/products`);

      setProducts(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  const handleGramChange = (productId, value) => {
    setSelectedGrams((prev) => ({
      ...prev,
      [productId]: parseFloat(value),
    }));
  };

  const calculateTotal = (product) => {
    const gramValue = selectedGrams[product._id] || 1;
    return (product.basePrice * gramValue).toFixed(0);
  };

  const handleAddToCart = (product) => {

    if (!product.active) return;

    const gramValue = selectedGrams[product._id] || 1;

    const newItem = {
      id: product._id,
      name: product.name,
      image: product.image,
      quantityKg: gramValue,
      basePrice: product.basePrice,
      totalPrice: product.basePrice * gramValue,
      count: 1,
    };

    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    existingCart.push(newItem);

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    updateCartCount();

    alert("Item added to cart ✅");
  };

  return (
    <div className="min-h-screen bg-cream">

      {/* NAVBAR */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <img
              src="/images/hero0.jpg"
              alt="Logo"
              className="h-9 object-contain"
            />
            <h1 className="text-lg sm:text-xl font-bold text-brand">
              Snehitha Products
            </h1>
          </div>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-brand"
          >
            <ShoppingCart size={24} />
            Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}

          </Link>

        </div>
      </nav>


      {/* HERO */}
      <section className="bg-brand text-white pt-32 sm:pt-28 pb-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">

          <div>

            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Pure & Authentic <br /> Homemade Masalas
            </h1>

            <p className="text-gray-200 max-w-lg">
              Carefully prepared traditional masalas using quality spices,
              delivering rich taste and aroma to every dish.
            </p>

          </div>

          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm">
              <img
                src="/images/hero1.jpg"
                alt="Brand"
                className="w-full object-contain"
              />
            </div>
          </div>

        </div>

      </section>


      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <h2 className="text-3xl font-bold text-brand mb-12">
          Our Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {products.map((product) => (

            <div
              key={product._id}
              className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-2xl transition duration-300"
            >

              {!product.active && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                  Out of Stock
                </div>
              )}

              {/* FIXED IMAGE */}
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-48 object-contain mb-4 ${
                  !product.active ? "opacity-50" : ""
                }`}
              />

              <h3 className="font-semibold text-lg mb-2">
                {product.name}
              </h3>

              <p className="text-brand font-bold mb-3">
                ₹{product.basePrice} / kg
              </p>

              <select
                disabled={!product.active}
                className="w-full border rounded-lg px-3 py-2 mb-3"
                onChange={(e) =>
                  handleGramChange(product._id, e.target.value)
                }
              >
                {gramOptions.map((gram) => (
                  <option key={gram.value} value={gram.value}>
                    {gram.label}
                  </option>
                ))}
              </select>

              <p className="text-sm text-gray-500 mb-3">
                Total: ₹{calculateTotal(product)}
              </p>

              <button
                disabled={!product.active}
                onClick={() => handleAddToCart(product)}
                className={`w-full py-2 rounded-lg transition ${
                  product.active
                    ? "bg-brand text-white hover:bg-brandHover"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                {product.active ? "Add to Cart" : "Unavailable"}
              </button>

            </div>

          ))}

        </div>

      </section>

      <ChatBot />

    </div>
  );
}

export default Home;