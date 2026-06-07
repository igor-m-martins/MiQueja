import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buildUrl } from "../utils/api";
import { truncateText } from "../utils/helpers";

function companyAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=ffffff&rounded=true&size=128`;
}

export default function Company() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchCompany() {
      setLoading(true);
      setError(null);
      setCompany(null);
      setComplaints([]);

      try {
        const response = await fetch(buildUrl(`company/${id}`));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar la empresa");
        }

        let companyData = null;

        if (Array.isArray(data) && data.length > 0) {
          companyData = data[0];
        } else if (data.company) {
          companyData = data.company;
        } else if (data && data.id) {
          companyData = data;
        }

        if (!companyData) {
          throw new Error("Empresa no encontrada");
        }

        setCompany(companyData);

        // Load complaints from the new route
        const complaintsResponse = await fetch(
          buildUrl(`company/${id}/complaints?page=${currentPage}&per_page=10`)
        );
        const complaintsData = await complaintsResponse.json();

        if (complaintsResponse.ok) {
          setComplaints(complaintsData.complaints || []);
          setTotalPages(complaintsData.total_pages || 1);
        }
      } catch (err) {
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [id, currentPage]);

  // truncateText is centralized in src/utils/helpers.js

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  if (!company) return <p className="text-center mt-10">Empresa no encontrada.</p>;

  // --- Resolution status ranking logic ---
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.resolved === 1).length;

  const resolutionRate = totalComplaints > 0 
    ? Math.round((resolvedComplaints / totalComplaints) * 100) 
    : 0;

  // STAR RATING CALCULATION (based on the resolution rate from 0 to 100)
  const starsRating = totalComplaints > 0 ? Math.round(resolutionRate / 20) : 0;

  let ratingLabel = "Sin quejas";
  let ratingColor = "text-gray-500 bg-gray-100";

  if (totalComplaints > 0) {
    if (resolutionRate >= 80) {
      ratingLabel = "Excelente";
      ratingColor = "text-green-800 bg-green-100";
    } else if (resolutionRate >= 50) {
      ratingLabel = "Regular";
      ratingColor = "text-amber-800 bg-amber-100";
    } else {
      ratingLabel = "Mala";
      ratingColor = "text-red-800 bg-red-100";
    }
  }
  // --------------------------------------------------------

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col gap-6 md:flex-row md:items-center">
        <img
          src={companyAvatarUrl(company.name)}
          alt={company.name}
          className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
        />
        <div className="flex-1">
          {/* Company name and star rating aligned side by side */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold">{company.name}</h1>
            
            {totalComplaints > 0 && (
              <div className="flex items-center text-amber-500 text-2xl select-none" title={`Nota: ${starsRating}/5`}>
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < starsRating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mt-2">Perfil de empresa</p>
          
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {/* CARD: Reputation / resolution index */}
            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Índice de Solución</p>
                <p className="text-2xl font-bold mt-1">
                  {totalComplaints > 0 ? `${resolutionRate}%` : "---"}
                </p>
                {totalComplaints > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {resolvedComplaints} de {totalComplaints} quejas resueltas en esta página.
                  </p>
                )}
              </div>
              <span className={`rounded-full px-4 py-2 text-sm font-bold ${ratingColor}`}>
                {ratingLabel}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">Estado de cuenta</p>
              <p className="font-semibold">
                {company.email_verified ? "Verificada" : "No Verificada"}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">RUT</p>
              <p className="font-semibold">{company.rut || "No informado"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{company.email}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">Creado en</p>
              <p className="font-semibold">
                {company.created_at ? new Date(company.created_at).toLocaleDateString() : "No informado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Últimas quejas</h2>
            <p className="text-gray-500 mt-1">
              Revisá las quejas más recentes relacionadas con esta empresa.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/new-complaint?companyId=${company.id}&companyName=${encodeURIComponent(
                company.name
              )}`}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700 transition"
            >
              Reportar nueva queja
            </Link>

            {!company.email_verified && (
              <Link
                to={`/register-company?claimCompanyId=${company.id}&site=${company.site}&companyName=${encodeURIComponent(
                  company.name
                )}`}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow hover:bg-gray-50 transition"
              >
                Informar que me pertenece
              </Link>
            )}
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
            No hay quejas registradas aún para esta empresa.
          </div>
        ) : (
          <ul className="mt-6 space-y-5">
            {complaints.map((complaint) => (
              <li
                key={complaint.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <Link
                      to={`/complaint-detail/${complaint.id}`}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      <h3 className="text-xl font-semibold">{complaint.title}</h3>
                    </Link>
                    
                    {/* Description limited to 180 characters with wrapping classes */}
                    <p className="text-gray-700 mt-2 text-sm leading-relaxed break-words">
                      {truncateText(complaint.description, 180)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      complaint.resolved === 1
                        ? "bg-green-100 text-green-800"
                        : complaint.response
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {complaint.resolved === 1
                      ? "Resuelto"
                      : complaint.response
                      ? "Respondido"
                      : "Pendiente"}
                  </span>
                </div>
                {complaint.response && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold">Respuesta de la empresa</p>
                    <p className="mt-2">{complaint.response}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
