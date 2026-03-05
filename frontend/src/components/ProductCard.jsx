import { useState } from "react";

const gramOptions = [100, 200, 250, 500, 1000, 2000, 5000, 10000];

function ProductCard({ product }) {
  const [selectedGram, setSelectedGram] = useState(100);

  const price = ((product.basePrice / 1000) * selectedGram).toFixed(0);

  return (
    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden group transition duration-500 hover:-translate-y-2 hover:shadow-2xl">

      {/* OUT OF STOCK OVERLAY */}
      {!product.active && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
          <span className="text-white text-lg font-bold">
            Out of Stock
          </span>
        </div>
      )}

      <img
        src={`http://localhost:5000/uploads/${product.image}`}
        alt={product.name}
        className="w-full h-60 object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="p-5 space-y-4">

        <h3 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h3>

        {/* Gram Selector */}
        <select
          className="w-full border rounded-lg px-3 py-2"
          value={selectedGram}
          onChange={(e) => setSelectedGram(Number(e.target.value))}
          disabled={!product.active}
        >
          {gramOptions.map((gram) => (
            <option key={gram} value={gram}>
              {gram >= 1000 ? `${gram / 1000}kg` : `${gram}g`}
            </option>
          ))}
        </select>

        {/* Price */}
        <p className="text-brand font-bold text-lg">
          ₹ {price}
        </p>

        {/* Add to Cart */}
        <button
          disabled={!product.active}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            product.active
              ? "bg-brand text-white hover:bg-brandHover"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default ProductCard;