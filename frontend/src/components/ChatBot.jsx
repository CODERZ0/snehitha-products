import { useState, useRef, useEffect } from "react";
import axios from "axios";

function ChatBot() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const chatEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hello 👋 I Snehitha here tell me sir/madam what you are looking for"
    }
  ]);

  const lastQuantityRef = useRef(1);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const formatWeight = (kg) => {
    if (kg >= 1) return `${kg} kg`;
    return `${kg * 1000} g`;
  };

  const calculatePrice = (product, quantityKg) => {
    return Math.round(product.basePrice * quantityKg);
  };

  const extractQuantity = (text) => {

    const gramMatch = text.match(/(\d+)\s*g/i);
    const kgMatch = text.match(/(\d+(\.\d+)?)\s*kg/i);

    if (gramMatch) return parseInt(gramMatch[1]) / 1000;
    if (kgMatch) return parseFloat(kgMatch[1]);

    return 1;
  };

  const handleScroll = () => {

    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    setIsUserScrolling(!isAtBottom);

  };

  useEffect(() => {

    if (!isUserScrolling) {

      chatEndRef.current?.scrollIntoView({
        behavior: "smooth"
      });

    }

  }, [chat, typing]);

  const addToCart = (product, quantityKg) => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const newItem = {

      id: product._id,
      name: product.name,
      image: product.image,
      quantityKg: quantityKg,
      basePrice: product.basePrice,
      totalPrice: calculatePrice(product, quantityKg),
      count: 1

    };

    cart.push(newItem);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} (${formatWeight(quantityKg)}) added to cart ✅`);

  };

  const sendMessage = async () => {

    if (!message.trim()) return;

    const quantity = extractQuantity(message);
    lastQuantityRef.current = quantity;

    const userMessage = {
      sender: "user",
      text: message
    };

    setChat(prev => [...prev, userMessage]);

    setMessage("");
    setTyping(true);
    setIsUserScrolling(false);

    try {

      const res = await axios.post(
        `${API}/api/chat`,
        { message: userMessage.text }
      );

      const botReply = {
        sender: "bot",
        text: res.data.reply,
        product: res.data.product || null,
        quantity: quantity
      };

      setChat(prev => [...prev, botReply]);

    }

    catch {

      setChat(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, AI service unavailable."
        }
      ]);

    }

    setTyping(false);

  };

  return (
    <>

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-brand text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-xl z-50"
      >
        💬
      </button>

      {open && (

        <div className="fixed bottom-20 right-4 w-[90%] max-w-[360px] h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">

          <div className="bg-brand text-white p-4 flex justify-between items-center">

            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div className="font-semibold">Snehitha AI</div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-lg"
            >
              ✕
            </button>

          </div>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 bg-[#ece5dd] flex flex-col gap-3"
          >

            {chat.map((c, i) => (

              <div
                key={i}
                className={`flex ${
                  c.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div className="max-w-[85%]">

                  <div
                    className={`px-4 py-2 rounded-2xl shadow text-sm ${
                      c.sender === "user"
                        ? "bg-[#dcf8c6]"
                        : "bg-white"
                    }`}
                  >
                    {c.text}
                  </div>

                  {c.product && (

                    <div className="mt-2 bg-white p-3 rounded-lg shadow w-[200px]">

                      <img
                        src={
                          c.product.image?.startsWith("http")
                            ? c.product.image
                            : `${API}/uploads/${c.product.image}`
                        }
                        alt={c.product.name}
                        className="w-full h-24 object-contain"
                      />

                      <h4 className="font-semibold text-sm mt-1">
                        {c.product.name}
                      </h4>

                      <p className="text-xs text-gray-600">
                        {formatWeight(c.quantity || 1)}
                      </p>

                      <p className="text-xs text-gray-500">
                        ₹{c.product.basePrice}/kg
                      </p>

                      <p className="text-brand font-bold text-sm">
                        ₹{calculatePrice(c.product, c.quantity || 1)}
                      </p>

                      <button
                        onClick={() => addToCart(c.product, c.quantity || 1)}
                        className="mt-2 bg-brand text-white w-full py-1 rounded text-sm"
                      >
                        Add to Cart
                      </button>

                    </div>

                  )}

                </div>

              </div>

            ))}

            {typing && (

              <div className="text-xs text-gray-500 italic">
                Snehitha is typing...
              </div>

            )}

            <div ref={chatEndRef}></div>

          </div>

          <div className="p-3 bg-white border-t flex gap-2">

            <input
              className="flex-1 p-3 bg-gray-100 rounded-full px-4 outline-none text-sm"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="bg-brand disabled:opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center"
            >
              ▲
            </button>

          </div>

        </div>

      )}

    </>
  );

}

export default ChatBot;