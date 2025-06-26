import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        MiQueja
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/notifications" className="hover:underline">
              Notificaciones
            </Link>
            <div className="relative group">
              <button className="hover:underline">{user.name}</button>
              <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow p-2 right-0 z-10">
                <Link
                  to="/perfil"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}