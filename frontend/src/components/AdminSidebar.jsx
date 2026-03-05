import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="w-64 bg-brand text-white min-h-screen p-6 fixed">

      <h2 className="text-2xl font-bold mb-10">
        Admin Panel
      </h2>

      <div className="flex flex-col gap-6">

        <Link
          to="/admin/dashboard"
          className="hover:bg-brandHover p-3 rounded-lg transition"
        >
          📦 Products
        </Link>

        <Link
          to="/home"
          className="hover:bg-brandHover p-3 rounded-lg transition"
        >
          🌐 View Website
        </Link>

      </div>
    </div>
  );
}

export default AdminSidebar;