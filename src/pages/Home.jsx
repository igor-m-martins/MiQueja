import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { buildUrl } from "../utils/api";
import { truncateText } from "../utils/helpers";

export default function Home() {
  const location = useLocation();
  const [complaints, setComplaints] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(location.search);
  const showVerifyEmailBanner = query.get("status") === "verify-email";

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const response = await fetch(buildUrl("complaints"));
        if (!response.ok) throw new Error("Error al cargar las quejas");

        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchAdvertisers() {
      try {
        const response = await fetch(buildUrl("advertisers"));
        if (response.ok) {
          const data = await response.json();
          setAdvertisers(data.advertisers || data || []);
        }
      } catch (err) {
        console.log("Advertisers failed to load:", err.message);
        // Example data for the banner
        setAdvertisers([
          {
            id: 1,
            name: "TechSupport",
            category: "Software",
            description: "Soluciona tus problemas",
            image: "https://ui-avatars.com/api/?name=TechSupport&background=0D8ABC&color=ffffff",
            website: "https://example.com",
            featured: true,
          },
          {
            id: 2,
            name: "Marketing Pro",
            category: "Marketing",
            description: "Gestiona tu reputación",
            image: "https://ui-avatars.com/api/?name=Marketing&background=10B981&color=ffffff",
            website: "https://example.com",
            featured: true,
          },
        ]);
      }
    }

    fetchComplaints();
    fetchAdvertisers();
  }, []);

  // truncateText is centralized in src/utils/helpers.js

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  const featuredAds = advertisers.filter((ad) => ad.featured).slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {showVerifyEmailBanner && (
        <div className="mb-6 rounded border border-blue-300 bg-blue-50 p-4 text-blue-900">
          ¡Registro exitoso! Revisa tu correo electrónico y confirma tu cuenta antes de iniciar sesión.
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Quejas Recientes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Complaint list - left side */}
        <div className="md:col-span-3">
          <ul className="space-y-4">
            {complaints.map((complaint) => (
              <li
                key={complaint.id}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <Link
                  to={`/complaint-detail/${complaint.id}`}
                  className="text-blue-600 text-xl font-semibold hover:underline block"
                >
                  {complaint.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  Empresa:{" "}
                  <Link
                    to={`/company/${complaint.company_id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {complaint.company_name}
                  </Link>
                </p>
                
                {/* Call truncation helper and adjust styling */}
                <p className="mt-2 text-gray-700 text-sm leading-relaxed break-words">
                  {truncateText(complaint.description, 180)}
                </p>
                
                <p className="mt-3 text-sm">
                  Estado:{" "}
                  {complaint.response ? (
                    <span className="text-blue-600 font-semibold">Contestada</span>
                  ) : complaint.resolved ? (
                    <span className="text-green-600 font-semibold">Resuelta</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pendiente</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right banner */}
        <div className="md:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Featured advertisers */}
            {featuredAds.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>Anunciantes destacados
                </h3>
                <div className="space-y-3">
                  {featuredAds.map((advertiser) => (
                    <a
                      key={advertiser.id}
                      href={advertiser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-3 hover:shadow-lg transition"
                    >
                      <img
                        src={advertiser.image}
                        alt={advertiser.name}
                        className="w-10 h-10 rounded-full mb-2"
                      />
                      <p className="font-bold text-sm text-blue-600">
                        {advertiser.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {advertiser.category}
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        {advertiser.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Widget - View all advertisers */}
            <Link
              to="/advertisers"
              className="block bg-purple-100 border border-purple-300 rounded-lg p-4 hover:bg-purple-200 transition text-center"
            >
              <p className="font-bold text-purple-700 mb-1">Más Opciones</p>
              <p className="text-sm text-purple-600">Ver todos los anunciantes</p>
            </Link>

            {/* Widget - Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">💡 Consejo</h4>
              <p className="text-sm text-blue-800">
                Busca soluciones en nuestros anunciantes asociados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
