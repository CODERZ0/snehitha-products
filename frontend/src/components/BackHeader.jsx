import { useNavigate } from "react-router-dom";

function BackHeader({ title }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center px-4 py-4 bg-white shadow-sm sticky top-0 z-50">

      <button
        onClick={() => navigate(-1)}
        className="text-brand font-semibold mr-4 text-lg"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold text-gray-800">
        {title}
      </h2>
    </div>
  );
}

export default BackHeader;