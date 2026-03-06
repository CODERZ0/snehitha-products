import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {

  const [cartItems, setCartItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateCart = (updated) => {
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increaseQty = (index) => {
    const updated = [...cartItems];
    updated[index].count += 1;
    updateCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cartItems];

    if (updated[index].count > 1) {
      updated[index].count -= 1;
      updateCart(updated);
    }
  };

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    updateCart(updated);
  };

  // ================= SUBTOTAL =================

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + Number(item.totalPrice || 0) * Number(item.count || 1),
    0
  );

  // ================= TOTAL WEIGHT =================

  const totalWeight = cartItems.reduce(
    (acc, item) =>
      acc + Number(item.quantityKg || 0) * Number(item.count || 1),
    0
  );

  // ================= DELIVERY =================

  let deliveryCharge = 0;

  if (totalWeight > 0) {
    if (totalWeight <= 1) {
      deliveryCharge = 100;
    } else {
      const extraKg = Math.ceil(totalWeight - 1);
      deliveryCharge = 100 + extraKg * 20;
    }
  }

  const total = subtotal + deliveryCharge;

  // ================= ORDER ID =================

  const generateOrderId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const timestamp = Date.now().toString().slice(-4);
    return `SP${timestamp}${random}`;
  };

  // ================= WHATSAPP CHECKOUT =================

  const handleWhatsAppCheckout = () => {

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill delivery details");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    const orderId = generateOrderId();

    const itemsText = cartItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}
Qty: ${item.count}
Weight: ${item.quantityKg} kg
Price: ₹${(item.totalPrice * item.count).toFixed(0)}`
      )
      .join("\n\n");

    const message = `
🛒 *New Order - Snehitha Products*
🧾 Order ID: *${orderId}*

${itemsText}

------------------------
Total Weight: ${totalWeight.toFixed(2)} kg
Subtotal: ₹${subtotal.toFixed(0)}
Delivery: ₹${deliveryCharge}
Total: ₹${total.toFixed(0)}
------------------------

📦 *Delivery Details*
Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}
City: ${form.city}
Pincode: ${form.pincode}

💳 Please share your payment details.
`;

    const encodedMessage = encodeURIComponent(message);

    const whatsappNumber = "917012754441";

    window.open(
      `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`,
      "_blank"
    );

    alert("Order sent successfully!");

    localStorage.removeItem("cart");
    setCartItems([]);
  };

  return (

    <div className="min-h-screen bg-cream px-4 sm:px-6 lg:px-8 py-10">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">

        <Link to="/home" className="text-brand font-medium text-sm sm:text-base">
          ← Back
        </Link>

        <h2 className="text-lg sm:text-2xl font-bold text-brand">
          Your Cart
        </h2>

      </div>


      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

        {/* LEFT SIDE */}

        <div className="lg:col-span-2 space-y-6">

          {cartItems.length === 0 && (

            <div className="text-center text-gray-500 text-lg">
              Your cart is empty
            </div>

          )}

          {cartItems.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
            >

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div className="flex gap-4 items-center">

                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${API}/uploads/${item.image}`
                    }
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border"
                  />

                  <div>

                    <h3 className="font-semibold text-base sm:text-lg">
                      {item.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500">
                      Selected: {item.quantityKg} kg
                    </p>

                    <p className="text-brand font-semibold mt-1">
                      ₹{(item.totalPrice * item.count).toFixed(0)}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <button
                    onClick={() => decreaseQty(index)}
                    className="bg-brand text-white w-8 h-8 rounded-md"
                  >
                    -
                  </button>

                  <span className="font-medium">
                    {item.count}
                  </span>

                  <button
                    onClick={() => increaseQty(index)}
                    className="bg-brand text-white w-8 h-8 rounded-md"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 text-xs sm:text-sm ml-2"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

          {/* DELIVERY DETAILS */}

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">

            <h3 className="text-lg font-semibold mb-5 text-brand">
              Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input
                placeholder="Full Name"
                className="border rounded-lg px-4 py-2"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Phone Number"
                className="border rounded-lg px-4 py-2"
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                placeholder="House / Street"
                className="border rounded-lg px-4 py-2 sm:col-span-2"
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <input
                placeholder="City"
                className="border rounded-lg px-4 py-2"
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              />

              <input
                placeholder="Pincode"
                className="border rounded-lg px-4 py-2"
                onChange={(e) =>
                  setForm({ ...form, pincode: e.target.value })
                }
              />

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="bg-white rounded-xl shadow-lg p-6 h-fit lg:sticky lg:top-24 border border-gray-100">

          <h3 className="text-xl font-semibold mb-6">
            Order Summary
          </h3>

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Delivery</span>
            <span>₹{deliveryCharge}</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(0)}</span>
          </div>

          <button
            onClick={handleWhatsAppCheckout}
            className="w-full bg-brand text-white py-3 rounded-xl mt-6 hover:bg-brandHover transition"
          >
            Checkout via WhatsApp
          </button>

        </div>

      </div>

    </div>

  );

}

export default Cart;