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

  // ✅ Loading state added
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    fetchProducts();
    updateCartCount();

    // ✅ Polling every 10 seconds
    const interval = setInterval(() => {
      fetchProducts();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  const fetchProducts = async () => {
    try {

      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

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

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    existingCart.push(newItem);

    localStorage.setItem("cart", JSON.stringify(existingCart));

    updateCartCount();

    alert("Item added to cart ✅");
  };

  return (
    <div className="min-h-screen bg-cream">

      {/* NAVBAR */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">

        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
              <img
                src="/images/hero0.jpg"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-sm sm:text-lg font-bold text-brand">
              Snehitha Products
            </h1>

          </div>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-brand text-sm"
          >
            <ShoppingCart size={20} />
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
      <section className="bg-brand text-white pt-24 pb-12">

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-8 items-center">

          <div>

            <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-3">
              Pure & Authentic Homemade Masalas
            </h1>

            <p className="text-sm sm:text-base text-gray-200 max-w-lg">
              Carefully prepared traditional masalas using quality spices,
              delivering rich taste and aroma to every dish.
            </p>

          </div>

          <div className="flex justify-center md:justify-end">

            <div className="bg-white rounded-xl p-4 shadow-md w-full max-w-[180px] md:max-w-[300px]">

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
      <section className="max-w-7xl mx-auto px-4 py-12">

        <h2 className="text-2xl font-bold text-brand mb-8">
          Our Products
        </h2>

        {/* ✅ Loading message */}
        {loading ? (

          <p className="text-center text-gray-500">
            Loading products...
          </p>

        ) : (

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">

            {products.map((product) => (

              <div
                key={product._id}
                className="relative bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition flex flex-col gap-2"
              >

                {!product.active && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Out
                  </div>
                )}

                <div className="w-full h-20 flex items-center justify-center">

                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `${API}/uploads/${product.image}`
                    }
                    alt={product.name}
                    className={`max-h-full max-w-full object-contain ${
                      !product.active ? "opacity-50" : ""
                    }`}
                  />

                </div>

                <h3 className="text-xs font-semibold text-center line-clamp-2 min-h-[34px]">
                  {product.name}
                </h3>

                <p className="text-brand text-xs font-bold text-center">
                  ₹{product.basePrice}/kg
                </p>

                <select
                  disabled={!product.active}
                  className="w-full border rounded px-2 py-1 text-xs"
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

                <p className="text-xs text-gray-500 text-center">
                  ₹{calculateTotal(product)}
                </p>

                <button
                  disabled={!product.active}
                  onClick={() => handleAddToCart(product)}
                  className={`w-full text-xs py-1 rounded ${
                    product.active
                      ? "bg-brand text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  Add
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

      <ChatBot />

    </div>
  );
}

export default Home;