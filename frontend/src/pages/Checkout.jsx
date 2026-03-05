import { useEffect, useState } from "react";
import BackHeader from "../components/BackHeader";

function Checkout() {

  const [cartItems, setCartItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

  }, []);

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

    if (totalWeight <= 1) deliveryCharge = 100;
    else {
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

  // ================= WHATSAPP ORDER =================

  const handleOrder = () => {

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

💳 Please share payment details.
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

    <div className="min-h-screen bg-cream">

      <BackHeader title="Checkout" />

      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* ORDER ITEMS */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-xl font-semibold mb-6">
            Order Items
          </h3>

          {cartItems.length === 0 && (
            <p className="text-gray-500">Cart is empty</p>
          )}

          {cartItems.map((item, index) => (

            <div
              key={index}
              className="flex items-center gap-4 mb-4 border-b pb-4"
            >

              <img
                src={`${API}/uploads/${item.image}`}
                alt={item.name}
                className="w-16 h-16 object-contain border rounded"
              />

              <div className="flex-1">

                <h4 className="font-semibold">
                  {item.name}
                </h4>

                <p className="text-sm text-gray-500">
                  {item.quantityKg} kg × {item.count}
                </p>

              </div>

              <div className="font-semibold text-brand">
                ₹{(item.totalPrice * item.count).toFixed(0)}
              </div>

            </div>

          ))}

        </div>


        {/* DELIVERY FORM */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-xl font-semibold mb-6">
            Delivery Details
          </h3>

          <div className="grid gap-4">

            <input
              placeholder="Full Name"
              className="border px-4 py-2 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Phone Number"
              className="border px-4 py-2 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              placeholder="Address"
              className="border px-4 py-2 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <input
              placeholder="City"
              className="border px-4 py-2 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />

            <input
              placeholder="Pincode"
              className="border px-4 py-2 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, pincode: e.target.value })
              }
            />

          </div>

          {/* SUMMARY */}

          <div className="mt-6 border-t pt-4 space-y-2">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{deliveryCharge}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>

          </div>

          <button
            onClick={handleOrder}
            className="w-full mt-6 bg-brand text-white py-3 rounded-xl hover:bg-brandHover"
          >
            Place Order via WhatsApp
          </button>

        </div>

      </div>

    </div>

  );

}

export default Checkout;