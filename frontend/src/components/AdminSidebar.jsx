import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="w-full md:w-64 bg-brand text-white md:min-h-screen p-4 md:p-6 md:fixed top-0 left-0 z-40">

      <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-10">
        Admin Panel
      </h2>

      <div className="flex md:flex-col gap-4 md:gap-6">

        <Link
          to="/admin/dashboard"
          className="hover:bg-brandHover p-3 rounded-lg transition text-sm md:text-base"
        >
          📦 Products
        </Link>

        <Link
          to="/home"
          className="hover:bg-brandHover p-3 rounded-lg transition text-sm md:text-base"
        >
          🌐 View Website
        </Link>

      </div>

    </div>
  );
}

export default AdminSidebar;