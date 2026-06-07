import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { buildUrl } from "../utils/api";
import { truncateText } from "../utils/helpers";

export default function UserProfile() {
  const { user } = useAuth();
  const [profileActive, setProfileActive] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;

    async function fetchProfileStatus() {
      try {
        const response = await fetch(buildUrl("user-profile"), { credentials: "include" });
        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          setProfileActive(Boolean(data.active));
        }
      } catch (err) {
        console.warn("Could not fetch profile active state", err);
      }
    }

    fetchProfileStatus();

    async function fetchComplaints() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(buildUrl(`user/${user.id}/complaints?page=${currentPage}&per_page=10`), { credentials: "include" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar reclamaciones");
        }

        let filtered = data.complaints || [];
        if (filter === "pending") {
          filtered = filtered.filter((c) => !c.resolved);
        } else if (filter === "resolved") {
          filtered = filtered.filter((c) => c.resolved);
        } else if (filter === "answered") {
          filtered = filtered.filter((c) => c.response);
        }

        setComplaints(filtered);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, [user, currentPage, filter]);

  if (!user)
    return <p className="text-center mt-10">Debes estar logado para ver tu perfil.</p>;
  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      {/* User profile */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=3b82f6&color=ffffff&rounded=true&size=128`}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-gray-600 mt-2">Perfil de usuario</p>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="h-3.5 w-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              Editar
            </button>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-semibold">{user.id}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-semibold">{user.type === "user" ? "Usuario" : "Empresa"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Estado</p>
                <p className={`font-semibold ${profileActive ? "text-green-800" : "text-red-800"}`}>
                  {profileActive ? "Activo" : "Inactivo"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My complaints */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Mis reclamaciones</h2>
            <p className="text-gray-500 mt-1">Todas las reclamaciones que has creado</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-full transition ${
              filter === "pending"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter("answered")}
            className={`px-4 py-2 rounded-full transition ${
              filter === "answered"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Contestadas
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-4 py-2 rounded-full transition ${
              filter === "resolved"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Resueltas
          </button>
        </div>

        {error && <p className="text-red-600 mb-6">{error}</p>}

        {complaints.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
            No hay reclamaciones que coincidan con el filtro.
          </div>
        ) : (
          <ul className="space-y-5">
            {complaints.map((complaint) => (
              <li
                key={complaint.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <Link
                      to={`/complaint-detail/${complaint.id}`}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      {complaint.title}
                    </Link>
                    <p className="text-gray-600 mt-2">{truncateText(complaint.description, 180)}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Empresa:{" "}
                      <Link
                        to={`/company/${complaint.company_id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {complaint.company_name}
                      </Link>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 lg:items-end">
                  {/* 1. Show "Resolved" if resolved, otherwise show "Pending" */}
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      complaint.resolved
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {complaint.resolved ? "Resuelto" : "Pendiente"}
                  </span>

                  {/* 2. CORRECTION: the "Answered" badge appears only if there is a response AND the complaint is not resolved */}
                  {complaint.response && !complaint.resolved && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      Contestada
                    </span>
                  )}
                </div>
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
