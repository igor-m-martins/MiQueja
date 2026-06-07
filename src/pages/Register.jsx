import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile"; // Import the ready-made Turnstile component
import { buildUrl } from "../utils/api";

// Real mathematical validation for Uruguayan identity card (mod 10 algorithm)
const validateUruguayanCI = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 8) return false;
  
  // If there are 7 digits, prepend a zero to normalize
  const ciClean = digits.length === 7 ? "0" + digits : digits;
  
  const factors = [2, 9, 8, 7, 6, 3, 4];
  let sum = 0;
  
  for (let i = 0; i < 7; i++) {
    sum += parseInt(ciClean[i], 10) * factors[i];
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(ciClean[7], 10);
};

// Real mathematical validation for Uruguayan RUT (mod 11 algorithm)
const validateUruguayanRUT = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 12) return false; // RUT always has 12 real digits
  if (digits.substring(0, 2) < "01" || digits.substring(0, 2) > "21") return false; // First 2 digits are department code (01 to 21)
  if (digits.substring(2, 8) === "000000") return false;

  const factors = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 11; i++) {
    sum += parseInt(digits[i], 10) * factors[i];
  }

  const remainder = sum % 11;
  let checkDigit = 11 - remainder;
  if (checkDigit === 11) checkDigit = 0;
  if (checkDigit === 10) checkDigit = 1; // Special RUT cases

  return checkDigit === parseInt(digits[11], 10);
};

// Simple password strength checker
const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: "", color: "" };
  if (pass.length < 8) return { score: 1, label: "Muy corta (mínimo 8)", color: "text-red-500 bg-red-100" };
  
  let points = 0;
  if (/[A-Z]/.test(pass)) points++; // Has uppercase character
  if (/[0-9]/.test(pass)) points++; // Has a number
  if (/[^A-Za-z0-9]/.test(pass)) points++; // Has a special character

  if (points <= 1) return { score: 2, label: "Débil", color: "text-orange-500 bg-orange-100" };
  if (points === 2) return { score: 3, label: "Media", color: "text-blue-500 bg-blue-100" };
  return { score: 4, label: "Fuerte ¡Excelente!", color: "text-green-600 bg-green-100" };
};

export default function Registro() {
  const navigate = useNavigate();
  const [registerType, setRegisterType] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New state to store the captcha token
  const [turnstileToken, setTurnstileToken] = useState(""); 

  const isCompany = registerType === "company";
  const endpoint = isCompany ? buildUrl("register/company") : buildUrl("register/user");
    
  const identifierLabel = isCompany ? "RUT de la empresa" : "Cédula de identidad";
  const identifierPlaceholder = isCompany ? "Ej: 219999990016" : "Ej: 1.234.567-8";

  const passwordStrength = getPasswordStrength(password);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Initial captcha validation before processing any data
    if (!turnstileToken) {
      setError("Por favor complete la verificación de seguridad.");
      setLoading(false);
      return;
    }

    // Strip special characters before validating and submitting
    const cleanIdentifier = ci.replace(/\D/g, "");

    if (isCompany && !validateUruguayanRUT(cleanIdentifier)) {
      setError("Por favor ingresa un RUT válido de 12 dígitos.");
      setLoading(false);
      return;
    }

    if (!isCompany && !validateUruguayanCI(cleanIdentifier)) {
      setError("La Cédula de Identidad ingresada no es válida en Uruguay.");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Por favor, mejora la seguridad de tu contraseña.");
      setLoading(false);
      return;
    }

    // Added turnstileToken to the payload sent to the backend
    const payload = isCompany
      ? { name, email, rut: cleanIdentifier, password, turnstileToken }
      : { name, email, ci: cleanIdentifier, password, turnstileToken };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data.detail || data.error || JSON.stringify(data) || res.statusText;
          throw new Error(msg);
        }
        navigate("/?status=verify-email");
      })
      .catch((err) => setError(err.message || "Error al conectar"))
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Crear una Cuenta</h1>
        <button
          type="button"
          className="px-4 py-2 rounded border border-purple-600 text-purple-600 hover:bg-purple-50 transition text-sm font-medium"
          onClick={() => {
            setRegisterType(isCompany ? "user" : "company");
            setCi("");
            setError(null);
            setTurnstileToken(""); // Reset the token if the user switches form type
          }}
        >
          {isCompany ? "Registro de Usuario" : "Registro de Empresa"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {isCompany ? "Nombre de la empresa:" : "Nombre completo:"}
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder={isCompany ? "Nombre de la empresa" : "Tu nombre completo"}
          />
        </label>
        
        <label className="block text-sm font-medium text-gray-700">
          Correo electrónico:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="correo@ejemplo.com"
          />
        </label>
        
        <label className="block text-sm font-medium text-gray-700">
          {identifierLabel}:
          <input
            type="text"
            required
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder={identifierPlaceholder}
          />
        </label>
        
        <label className="block text-sm font-medium text-gray-700">
          Contraseña:
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Mínimo 8 caracteres"
          />
        </label>

        {/* Visual password feedback */}
        {password && (
          <div className={`p-2 rounded text-xs font-semibold ${passwordStrength.color}`}>
            Contraseña {passwordStrength.label}
          </div>
        )}

        {/* Centralized Turnstile instance in the form*/}
        <div className="flex justify-center my-2">
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY || "0x4AAAAAADfD21Meri4mIUXd"}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setError("Error en la verificación de seguridad.")}
            onExpire={() => setTurnstileToken("")}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-medium"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}