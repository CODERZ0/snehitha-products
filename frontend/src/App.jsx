import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Products Page */}
        <Route path="/home" element={<Home />} />

        {/* Cart Page */}
        <Route path="/cart" element={<Cart />} />

        {/* Admin Login */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Checkout Page */}
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;