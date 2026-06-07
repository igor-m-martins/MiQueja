import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { buildUrl } from "../utils/api";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [responseText, setResponseText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const localCompany = JSON.parse(localStorage.getItem("user"));

  const isCompanyOwner =
    localCompany?.type === "company" &&
    String(localCompany.id) === String(complaint?.company_id);


  async function handleResolveStatus(resolvedValue) {
    // resolvedValue will be 1 for "Resolved" or 0 for "Unresolved"
    try {
      const response = await fetch(buildUrl(`complaint/${id}/resolve`), {
        method: "PUT", // Verify that your backend accepts PUT for this route
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Required to send the logged-in user's session cookie
        body: JSON.stringify({ resolved: resolvedValue }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error ao atualizar o status");
      }

      // Update local state to reflect the change immediately
      setComplaint((prev) => ({ ...prev, resolved: resolvedValue }));
      alert(`Queja atualizada com sucesso!`);
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  }

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const response = await fetch(buildUrl(`complaint/${id}`));
        if (!response.ok) throw new Error("Error al cargar la queja");

        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
          setComplaint(null);
        } else {
          setComplaint(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComplaint();
  }, [id]);

  async function handleSubmitResponse(e) {
    e.preventDefault();
    setSuccessMessage("");
    setSubmitError("");

    try {
      const response = await fetch(buildUrl(`complaint-detail/${id}/reply`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ response: responseText }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Error desconocido");

      setSuccessMessage("Respuesta enviada con éxito.");
      setComplaint((prev) => ({ ...prev, response: responseText }));
      setResponseText("");
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!complaint) return <p>Queja no encontrada.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-4">{complaint.title}</h1>
      <h2 className="text-xl font-semibold mb-2 text-blue-600">
        <Link
          to={`/company/${complaint.company_id}`}
          className="text-blue-600 font-semibold"
        >
          {complaint.company_name}
        </Link>
      </h2>

      <section className="mb-6">
        <p>{complaint.description}</p>
        <p className="text-sm text-gray-500">{complaint.created_at}</p>
      </section>

      {complaint.response && (
        <section className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                complaint.company_name || "Empresa"
              )}&background=10B981&color=ffffff&bold=true`}
              alt={complaint.company_name}
              className="w-12 h-12 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-bold text-green-800 mb-1">
                Respuesta de {complaint.company_name}
              </h3>
              <p className="text-gray-700">{complaint.response}</p>
            </div>
          </div>
        </section>
      )}

      <p className="text-sm mb-4">
        Estado:{" "}
        {complaint.resolved === 1 ? (
          // 1. If marked as resolved, the highest priority is to display "Resolved"
          <span className="text-green-600 font-semibold">Resuelta</span>
        ) : complaint.response ? (
          // 2. If not resolved but the company has responded, show "Answered"
          <span className="text-blue-600 font-semibold">Contestada</span>
        ) : (
          // 3. If not resolved and no response is present, show "Pending"
          <span className="text-red-600 font-semibold">Pendiente</span>
        )}
      </p>

      {isCompanyOwner && !complaint.response && (
        <div className="mt-10 border-t pt-6">
          <form
            onSubmit={handleSubmitResponse}
            className="flex flex-col items-center"
          >
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Escribe una respuesta..."
              rows={4}
              className="w-full max-w-xl p-3 border rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full max-w-xl bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Enviar respuesta
            </button>
          </form>
          {successMessage && (
            <p className="mt-4 text-green-600 font-semibold">{successMessage}</p>
          )}
          {submitError && (
            <p className="mt-4 text-red-600 font-semibold">{submitError}</p>
          )}
        </div>
      )}

      {localCompany?.type === "user" &&
        String(localCompany.id) === String(complaint.user_id) &&
        complaint.response && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => handleResolveStatus(1)} // 1 to mark as Resolved
            >
              Resuelto
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={() => handleResolveStatus(0)} // 0 to mark as Unresolved
            >
              No Resuelto
            </button>
          </div>
        )}
    </div>
  );
}