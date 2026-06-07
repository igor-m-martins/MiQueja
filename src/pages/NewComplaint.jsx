import { useEffect, useState, useRef } from "react"; 
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Turnstile } from "@marsidev/react-turnstile"; 
import { buildUrl } from "../utils/api";

export default function NewComplaint() {
  const [companyQuery, setCompanyQuery] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [companyResults, setCompanyResults] = useState([]);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [companySearchError, setCompanySearchError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  // State for Turnstile and privacy consent (LGPD / Ley 18.331)
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const turnstileRef = useRef(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const TURNSTILE_SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY || "0x4AAAAAADfD21Meri4mIUXd";

  useEffect(() => {
    const companyIdParam = searchParams.get("companyId");
    const companyNameParam = searchParams.get("companyName");

    if (companyNameParam) {
      setCompanyQuery(companyNameParam);
    }
    if (companyIdParam) {
      const parsedId = Number(companyIdParam);
      if (!Number.isNaN(parsedId)) {
        setCompanyId(parsedId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!companyQuery.trim()) {
      setCompanyResults([]);
      setCompanySearchError(null);
      setCompanyId(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setCompanySearchLoading(true);
      setCompanySearchError(null);

      try {
        const response = await fetch(buildUrl(`companies/search?q=${encodeURIComponent(companyQuery)}`));

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Error al buscar empresas");
        }

        const data = await response.json();
        setCompanyResults(data || []);
      } catch (err) {
        setCompanySearchError(err.message);
      } finally {
        setCompanySearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [companyQuery]);

  function handleSelectCompany(company) {
    setCompanyQuery(company.name);
    setCompanyId(company.id);
    setCompanyResults([]);
    setCompanySearchError(null);
  }

  function handleCompanyQueryChange(value) {
    setCompanyQuery(value);
    if (companyId !== null) {
      setCompanyId(null);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!user) {
      setError("Debes estar logado para enviar una queja.");
      setLoading(false);
      return;
    }

    if (!companyQuery.trim()) {
      setError("Indica la empresa para registrar la queja.");
      setLoading(false);
      return;
    }

    if (!privacyAccepted) {
      setError("Debe confirmar que ha revisado la no inclusión de datos personales.");
      setLoading(false);
      return;
    }

    if (!turnstileToken) {
      setError("Por favor, completa el desafío de seguridad (Captcha).");
      setLoading(false);
      return;
    }

    fetch(buildUrl("new-complaint"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: companyQuery,
        company_id: companyId,
        title,
        description,
        turnstile_token: turnstileToken,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data.detail || data.error || JSON.stringify(data) || res.statusText;
          throw new Error(msg);
        }
        setMessage("Queja enviada con éxito.");
        setCompanyQuery("");
        setCompanyId(null);
        setTitle("");
        setDescription("");
        setCompanyResults([]);
        setPrivacyAccepted(false);
        navigate("/");
      })
      .catch((err) => {
        setError(err.message || "Error al enviar la queja");
        if (turnstileRef.current) turnstileRef.current.reset();
        setTurnstileToken(null);
      })
      .finally(() => setLoading(false));
  }

  // Reset the token if the user unchecks the privacy checkbox after completing the captcha
  function handlePrivacyChange(e) {
    const isChecked = e.target.checked;
    setPrivacyAccepted(isChecked);
    if (!isChecked) {
      setTurnstileToken(null);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Nueva Queja</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Empresa:
          <input
            type="text"
            value={companyQuery}
            onChange={(e) => handleCompanyQueryChange(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Busca y selecciona la empresa"
          />
        </label>
        {companySearchLoading && (
          <p className="text-sm text-gray-500">Buscando empresas...</p>
        )}
        {companySearchError && (
          <p className="text-sm text-red-600">{companySearchError}</p>
        )}
        {companyResults.length > 0 && (
          <div className="rounded border border-gray-200 bg-white shadow-sm max-h-64 overflow-y-auto">
            {companyResults.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelectCompany(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
              >
                <p className="font-semibold">{result.name}</p>
                <p className="text-xs text-gray-500">RUT: {result.rut || 'No informado'}</p>
              </button>
            ))}
          </div>
        )}
        {companyQuery.trim() && !companySearchLoading && companyResults.length === 0 && (
          <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
            No se encontró la empresa. Puedes registrar la empresa en el sistema para crear una nueva queja.
            <button
              type="button"
              onClick={() => navigate('/register-company')}
              className="ml-2 font-semibold text-blue-600 hover:underline"
            >
              Registrar empresa
            </button>
          </div>
        )}
        
        <label className="block">
          Título:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Título breve de la queja"
          />
        </label>

        {/* Privacy alert box (Law No. 18.331) */}
        <div className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div>
              <p className="font-bold mb-1">Recordatorio importante de privacidad:</p>
              <p>
                Esta queja será de acceso público. Conforme a la <strong>Ley N° 18.331 de Protección de Datos Personales</strong>, evite incluir datos sensibles en el cuerpo del texto (tales como su número de cédula de identidad, teléfono de contacto, dirección residencial, correos electrónicos o datos de salud).
              </p>
            </div>
          </div>
        </div>

        <label className="block">
          Descripción:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Detalle de la queja de forma clara y anónima..."
            rows={5}
          />
        </label>

        {/* Consent checkbox box */}
        <div className="pt-2 bg-gray-50 p-4 rounded-md border border-gray-200">
          <label className="flex items-start space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={handlePrivacyChange}
              required
              className="mt-1 h-5 w-5 rounded border-2 border-gray-400 text-blue-600 focus:ring-blue-500 bg-white accent-blue-600"
            />
            <span className="text-sm text-gray-700 font-medium">
              Confirmo que esta queja es pública, que la información es verídica y garantizo que <strong className="text-red-600">no he incluido datos personales</strong> que expongan mi privacidad o la de terceros.
            </span>
          </label>
        </div>

        {/* The Captcha will only render if privacyAccepted is TRUE */}
        {privacyAccepted ? (
          <div className="flex justify-center my-2 min-h-[65px] animate-fadeIn">
            <Turnstile
              ref={turnstileRef}
              siteKey={TURNSTILE_SITEKEY}
              options={{
                size: "normal"
              }}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
              onError={() => setTurnstileToken(null)}
            />
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-gray-400 italic bg-gray-50 border border-dashed rounded">
            Por favor, acepte los términos de privacidad arriba para habilitar la verificación de seguridad.
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          disabled={loading || !turnstileToken || !privacyAccepted}
        >
          {loading ? "Enviando..." : "Enviar queja"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
