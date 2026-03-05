import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">

          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img src="/images/hero0.jpg" alt="Logo" className="h-10" />
            <h1 className="text-xl md:text-2xl font-bold text-brand">
              Snehitha Products
            </h1>
          </div>

          {/* Menu */}
          <div className="hidden md:flex gap-8 font-medium text-gray-700">
            <a href="#home" className="hover:text-brand">Home</a>
            <a href="#about" className="hover:text-brand">About</a>
            <a href="#products" className="hover:text-brand">Products</a>
            <a href="#contact" className="hover:text-brand">Contact</a>
          </div>

        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section
        id="home"
        className="pt-28 min-h-screen bg-brand text-white flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-3xl md:text-6xl font-extrabold leading-tight mb-6">
              Pure & Authentic <br />
              Homemade Masalas
            </h2>

            <p className="text-base md:text-lg text-gray-200 mb-8 max-w-lg">
              Carefully prepared traditional masalas using quality spices,
              delivering rich taste and aroma to every dish.
            </p>

            <Link to="/home">
              <button className="bg-white text-brand px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">
                Shop Now
              </button>
            </Link>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-md">
              <img
                src="/images/hero1.jpg"
                alt="Brand"
                className="w-full object-contain"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-24 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <img
            src="/images/hero2.jpg"
            alt="About"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section id="products" className="py-24 bg-gray-100 space-y-24">
        {[3, 4, 5, 6, 7].map((num) => (
          <div key={num} className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="group overflow-hidden rounded-2xl shadow-xl transition duration-500">
              <img
                src={`/images/hero${num}.jpg`}
                alt={`hero${num}`}
                className="w-full rounded-2xl transform transition duration-700 group-hover:scale-105 group-hover:-translate-y-3 group-hover:shadow-2xl"
              />
            </div>
          </div>
        ))}
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-24 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <img
            src="/images/hero8.jpg"
            alt="Contact"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      </section>

    </div>
  );
}

export default Landing;