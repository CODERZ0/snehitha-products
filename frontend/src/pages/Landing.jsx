import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">

        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* Logo + Title */}
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

          {/* Menu */}
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-gray-700">

            <a href="#home" className="hover:text-brand">
              Home
            </a>

            <a href="#about" className="hover:text-brand">
              About
            </a>

            <a href="#products" className="hover:text-brand">
              Products
            </a>

            <a href="#contact" className="hover:text-brand">
              Contact
            </a>

          </div>

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}
      <section
        id="home"
        className="bg-brand text-white pt-24 pb-10"
      >

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-2 gap-6 items-center">

          {/* TEXT */}
          <div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3">
              Pure & Authentic Homemade Masalas
            </h2>

            <p className="text-sm sm:text-base text-gray-200 mb-4">
              Carefully prepared traditional masalas using quality spices,
              delivering rich taste and aroma to every dish.
            </p>

            <Link to="/home">
              <button className="bg-white text-brand px-4 py-2 rounded-lg font-semibold shadow text-sm">
                Shop Now
              </button>
            </Link>

          </div>


          {/* LOGO */}
          <div className="flex justify-center">

            <div className="bg-white rounded-xl p-3 shadow-md w-full max-w-[180px] sm:max-w-xs">

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
      <section id="about" className="py-10 px-4 bg-white">

        <div className="max-w-6xl mx-auto">

          <img
            src="/images/hero2.jpg"
            alt="About"
            className="w-full rounded-xl shadow-lg"
          />

        </div>

      </section>


      {/* ================= PRODUCTS SECTION ================= */}
      <section id="products" className="py-10 bg-gray-100 space-y-10">

        {[3,4,5,6,7].map((num) => (

          <div key={num} className="max-w-6xl mx-auto px-4">

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
      <section id="contact" className="py-10 px-4 bg-white">

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