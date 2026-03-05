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
      text: "Hello 👋 I am Snehitha AI. Ask me about spices, masalas, cooking suggestions or ordering."
    }
  ]);

  const lastQuantityRef = useRef(1);

  // Detect quantity from message
  const extractQuantity = (text) => {

    const gramMatch = text.match(/(\d+)\s*g/i);
    const kgMatch = text.match(/(\d+(\.\d+)?)\s*kg/i);

    if (gramMatch) {
      return parseInt(gramMatch[1]) / 1000;
    }

    if (kgMatch) {
      return parseFloat(kgMatch[1]);
    }

    return 1;
  };

  // Detect manual scrolling
  const handleScroll = () => {

    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    setIsUserScrolling(!isAtBottom);

  };

  // Auto scroll
  useEffect(() => {

    if (!isUserScrolling) {

      const scrollToBottom = () => {

        chatEndRef.current?.scrollIntoView({
          behavior: "smooth"
        });

      };

      const timeoutId = setTimeout(scrollToBottom, 100);

      return () => clearTimeout(timeoutId);

    }

  }, [chat, typing, isUserScrolling]);

  // Add to Cart
  const addToCart = (product, quantityKg) => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const newItem = {

      id: product._id,
      name: product.name,
      image: product.image,
      quantityKg: quantityKg,
      basePrice: product.basePrice,
      totalPrice: product.basePrice * quantityKg,
      count: 1

    };

    cart.push(newItem);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} (${quantityKg * 1000}g) added to cart ✅`);

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
        "http://localhost:5000/api/chat",
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

    catch (error) {

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

      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-brand text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-xl z-50 transition-transform active:scale-90"
      >
        💬
      </button>

      {open && (

        <div className="fixed bottom-0 right-0 sm:bottom-24 sm:right-3 md:right-6 w-full sm:w-[95%] sm:max-w-sm h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">

          {/* Header */}
          <div className="bg-brand text-white p-4 flex justify-between items-center shadow-md shrink-0">

            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div className="font-semibold text-base">Snehitha AI</div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-lg"
            >
              ✕
            </button>

          </div>

          {/* Chat Area */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 bg-[#ece5dd] flex flex-col gap-3 overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
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

                  {/* Message bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${
                      c.sender === "user"
                        ? "bg-[#dcf8c6] rounded-tr-none"
                        : "bg-white rounded-tl-none border border-gray-100"
                    }`}
                  >
                    {c.text}
                  </div>

                  {/* Product Card */}
                  {c.product && (

                    <div className="mt-2 bg-white p-3 rounded-lg shadow w-[210px]">

                      <img
                        src={`http://localhost:5000/uploads/${c.product.image}`}
                        alt={c.product.name}
                        className="w-full h-28 object-contain"
                      />

                      <h4 className="font-semibold text-sm mt-1">
                        {c.product.name}
                      </h4>

                      <p className="text-sm text-gray-600">
                        {(c.quantity || 1) * 1000} g
                      </p>

                      <p className="text-brand font-bold text-sm">
                        ₹{c.product.basePrice * (c.quantity || 1)}
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

              <div className="flex justify-start">

                <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm text-xs text-gray-500 italic">
                  Snehitha is typing...
                </div>

              </div>

            )}

            <div ref={chatEndRef} className="h-4 shrink-0" />

          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t flex gap-2 shrink-0 pb-safe">

            <input
              className="flex-1 p-3 bg-gray-100 rounded-full px-4 outline-none text-base border border-transparent focus:border-brand/30"
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
              className="bg-brand disabled:opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all hover:shadow-lg active:scale-95"
            >
              <span className="rotate-90">▲</span>
            </button>

          </div>

        </div>

      )}

    </>
  );

}

export default ChatBot;