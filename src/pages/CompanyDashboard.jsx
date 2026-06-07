import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { buildUrl } from "../utils/api";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [urgentComplaints, setUrgentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.type !== "company") return;

    async function fetchDashboard() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(buildUrl(`company/${user.id}/dashboard`), { credentials: "include" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar dashboard");
        }

        setStats(data.stats);
        setUrgentComplaints(data.urgent_complaints || []);
      } catch (err) {
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [user]);

  if (!user || user.type !== "company")
    return (
      <p className="text-center mt-10">Debes estar logado como empresa para ver el dashboard.</p>
    );
  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Company profile */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=10b981&color=ffffff&rounded=true&size=128`}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-gray-600 mt-2">Panel de empresa</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-semibold">{user.id}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="bg-red-50 rounded-3xl border border-red-200 p-6">
          <p className="text-sm text-red-600">Pendientes de responder</p>
          <p className="text-4xl font-bold text-red-700 mt-2">{stats?.pending || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-3xl border border-yellow-200 p-6">
          <p className="text-sm text-yellow-600">Respondidas</p>
          <p className="text-4xl font-bold text-yellow-700 mt-2">{stats?.responded || 0}</p>
        </div>
        <div className="bg-green-50 rounded-3xl border border-green-200 p-6">
          <p className="text-sm text-green-600">Resueltas</p>
          <p className="text-4xl font-bold text-green-700 mt-2">{stats?.resolved || 0}</p>
        </div>
      </div>

      {/* Urgent complaints */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Reclamaciones pendientes</h2>
          <p className="text-gray-500 mt-1">Requieren tu respuesta urgentemente</p>
        </div>

        {error && <p className="text-red-600 mb-6">{error}</p>}

        {urgentComplaints.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-green-200 bg-green-50 p-8 text-center text-green-700">
            ✓ No hay reclamaciones pendientes. ¡Excelente trabajo!
          </div>
        ) : (
          <ul className="space-y-5">
            {urgentComplaints.map((complaint) => (
              <li
                key={complaint.id}
                className="rounded-3xl border-2 border-red-300 bg-red-50 p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <Link
                      to={`/complaint-detail/${complaint.id}`}
                      className="text-xl font-semibold text-red-700 hover:underline"
                    >
                      {complaint.title}
                    </Link>
                    <p className="text-gray-700 mt-2">{complaint.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Usuario ID: {complaint.user_id}
                    </p>
                  </div>
                  <Link
                    to={`/complaint-detail/${complaint.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3 text-white shadow hover:bg-red-700 transition font-semibold"
                  >
                    Responder
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <Link
            to={`/company/${user.id}`}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700 transition"
          >
            Ver todas las reclamaciones
          </Link>
        </div>
      </section>
    </div>
  );
}
