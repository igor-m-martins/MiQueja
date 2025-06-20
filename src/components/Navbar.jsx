import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MiQueja
      </Link>
      <div className="space-x-4">
        <Link to="/new-complaint" className="text-gray-700 hover:text-blue-600 transition">
          Nueva Queja
        </Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-600 transition">
          Registrarse
        </Link>
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Login
        </Link>
      </div>
    </nav>
  );
}
