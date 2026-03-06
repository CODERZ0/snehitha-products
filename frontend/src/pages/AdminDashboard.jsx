import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "masalas",
    basePrice: "",
    image: null
  });

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin");
    }

  }, []);

  const getAuthHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    };
  };

  const fetchProducts = async () => {

    try {

      const res = await axios.get(`${API}/api/products`);

      setProducts(res.data);

    } catch (error) {

      console.log("FETCH PRODUCTS ERROR:", error);

    }

  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {

    e.preventDefault();

    if (!form.image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("basePrice", form.basePrice);
    formData.append("image", form.image);

    try {

      await axios.post(
        `${API}/api/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Product added successfully ✅");

      setForm({
        name: "",
        category: "masalas",
        basePrice: "",
        image: null
      });

      fetchProducts();

    } catch (error) {

      console.log("ADD PRODUCT ERROR:", error);

      alert(error?.response?.data?.message || "Error adding product");

    }

  };

  const toggleActive = async (product) => {

    try {

      await axios.put(
        `${API}/api/products/${product._id}`,
        { active: !product.active },
        getAuthHeader()
      );

      fetchProducts();

    } catch (error) {

      console.log("TOGGLE ERROR:", error);
      alert("Update failed");

    }

  };

  const updatePrice = async (id, newPrice) => {

    try {

      await axios.put(
        `${API}/api/products/${id}`,
        { basePrice: newPrice },
        getAuthHeader()
      );

      fetchProducts();

    } catch (error) {

      console.log("PRICE UPDATE ERROR:", error);
      alert("Price update failed");

    }

  };

  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      await axios.delete(
        `${API}/api/products/${id}`,
        getAuthHeader()
      );

      fetchProducts();

    } catch (error) {

      console.log("DELETE ERROR:", error);
      alert("Delete failed");

    }

  };

  const logout = () => {

    localStorage.removeItem("adminToken");

    navigate("/admin");

  };

  return (

    <div className="flex flex-col md:flex-row bg-cream min-h-screen">

      <AdminSidebar />

      <div className="w-full md:ml-64 p-4 sm:p-6 md:p-10">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">

          <h1 className="text-2xl md:text-3xl font-bold text-brand">
            Product Management
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg w-fit"
          >
            Logout
          </button>

        </div>

        {/* ADD PRODUCT */}

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-10">

          <h2 className="text-xl font-semibold mb-6">
            Add New Product
          </h2>

          <form
            onSubmit={handleAddProduct}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <input
              type="text"
              placeholder="Product Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border p-3 rounded-lg"
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="border p-3 rounded-lg"
            >
              <option value="masalas">Masalas</option>
              <option value="powders">Powders</option>
              <option value="other">Other</option>
            </select>

            <input
              type="number"
              placeholder="Price Per KG"
              required
              value={form.basePrice}
              onChange={(e) =>
                setForm({ ...form, basePrice: e.target.value })
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setForm({ ...form, image: e.target.files[0] })
              }
              className="border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="md:col-span-2 bg-brand text-white py-3 rounded-lg hover:bg-brandHover transition"
            >
              Add Product
            </button>

          </form>

        </div>

        {/* PRODUCT TABLE */}

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">

          <h2 className="text-xl font-semibold mb-6">
            All Products
          </h2>

          <div className="w-full overflow-x-auto">

            <table className="min-w-[900px] w-full text-left">

              <thead className="border-b bg-gray-50">

                <tr>

                  <th className="p-4">Image</th>
                  <th className="p-4 w-[280px]">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price/KG</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>

                </tr>

              </thead>

              <tbody>

                {products.map((product) => (

                  <tr
                    key={product._id}
                    className="border-b h-[95px]"
                  >

                    {/* IMAGE */}
                    <td className="p-4">

                      <div className="w-[70px] h-[70px] flex items-center justify-center">

                        <img
                          src={
                            product.image?.startsWith("http")
                              ? product.image
                              : `${API}/uploads/${product.image}`
                          }
                          alt={product.name}
                          className="max-w-[60px] max-h-[60px] object-contain"
                        />

                      </div>

                    </td>

                    {/* NAME */}
                    <td className="p-4">

                      <div className="h-[48px] flex items-center overflow-hidden">

                        <span className="line-clamp-2">
                          {product.name}
                        </span>

                      </div>

                    </td>

                    {/* CATEGORY */}
                    <td className="p-4 capitalize">
                      {product.category}
                    </td>

                    {/* PRICE */}
                    <td className="p-4">

                      <input
                        type="number"
                        defaultValue={product.basePrice}
                        onBlur={(e) =>
                          updatePrice(product._id, e.target.value)
                        }
                        className="border p-2 rounded w-24"
                      />

                    </td>

                    {/* STATUS */}
                    <td className="p-4">

                      <span
                        className={
                          product.active
                            ? "text-green-600 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {product.active
                          ? "Available"
                          : "Out of Stock"}
                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 flex items-center gap-6">

                      <button
                        onClick={() => toggleActive(product)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          product.active
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white ${
                            product.active
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(product._id)
                        }
                        className="text-red-500 text-lg hover:text-red-700"
                      >
                        🗑
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;