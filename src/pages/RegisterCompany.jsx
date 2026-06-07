import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildUrl } from "../utils/api";

const validateUruguayanRUT = (value) => {
  const digits = value.replace(/\D/g, "");
  return /^\d{8,12}$/.test(digits);
};

export default function RegisterCompany() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const prefillName = params.get("companyName") || "";
  const claimCompanyId = params.get("claimCompanyId") || null;

  const [name, setName] = useState(prefillName);
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [rut, setRut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Strict local validation for RUT format
    if (!validateUruguayanRUT(rut)) {
      setError("Por favor, ingrese un RUT válido de Uruguay (de 8 a 12 dígitos numéricos).");
      setLoading(false);
      return;
    }

    fetch(buildUrl("register/company"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        site: site.trim(),
        rut: rut.trim(),
        company_id: claimCompanyId,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data.detail || data.error || "Error al procesar el registro";
          throw new Error(msg);
        }
        
        setMessage("Empresa registrada y verificada con éxito.");
        setError(null);
        
        setTimeout(() => {
          navigate(`/new-complaint?companyName=${encodeURIComponent(name)}`);
        }, 2000);
      })
      .catch((err) => setError(err.message || "Erro ao registrar a empresa"))
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-slate-100 shadow-xl mt-10 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Registro Oficial de Empresa
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Todos los campos fiscales y de contacto son estrictamente obligatorios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Nombre Comercial de la Empresa
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Ej. Nombre Oficial S.A."
            disabled={!!prefillName}
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Correo Electrónico Corporativo
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="contacto@empresa.com"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          RUT
          <input
            type="text"
            required
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
            placeholder="Ej. 21XXXXXXXXXX"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Sitio Web Oficial
          <input
            type="url"
            required
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
            placeholder="https://www.empresa.com"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition active:scale-[0.99] disabled:opacity-50 mt-2 shadow-md"
          disabled={loading}
        >
          {loading ? "Procesando Registro Fiscal..." : "Registrar Empresa Oficial"}
        </button>
      </form>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium p-3 rounded-xl text-center">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium p-3 rounded-xl text-center">
          {message}
        </div>
      )}
    </div>
  );
}