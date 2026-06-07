import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { buildUrl } from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loginType, setLoginType] = useState("user"); // "user" or "company"
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const endpoint = loginType === "company" ? buildUrl("login-company") : buildUrl("login-user");

    fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data.detail || data.error || JSON.stringify(data) || res.statusText;
          throw new Error(msg);
        }
        const user = data.user || data.usuario || (data.name ? { id: data.id, name: data.name, email: data.email, type: data.type } : null);
        if (!user) {
          throw new Error("Respuesta de login inválida");
        }
        login(user);
        setMessage("Sesión iniciada con éxito.");
        navigate("/");
      })
      .catch((err) => setError(err.message || "Error al conectar"))
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        {loginType === "company" ? "Iniciar Sesión - Empresa" : "Iniciar Sesión - Usuario"}
      </h1>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setLoginType("user")}
          className={`flex-1 px-4 py-2 rounded transition ${
            loginType === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Usuario
        </button>
        <button
          type="button"
          onClick={() => setLoginType("company")}
          className={`flex-1 px-4 py-2 rounded transition ${
            loginType === "company"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Empresa
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Correo Electrónico:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Tu correo electrónico"
          />
        </label>
        <label className="block">
          Contraseña:
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Tu contraseña"
          />
        </label>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {message && <p className="mt-4 text-green-600">{message}</p>}

      {/* ADDED BLOCK: dynamic registration link based on login type */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-600">
        {loginType === "company" ? (
          <p>
            ¿Tu empresa não está registrada?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Registrar Empresa
            </Link>
          </p>
        ) : (
          <p>
            ¿No tienes una cuenta de usuario?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
