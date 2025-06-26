import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const response = await fetch(
          "https://eliteworldwidecompany.pythonanywhere.com/miqueja/api/complaints"
        );
        if (!response.ok) throw new Error("Error al cargar las quejas");

        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Quejas Recientes</h1>
      <ul className="space-y-4">
        {complaints.map((complaint) => (
          <li
            key={complaint.id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <Link
              to={`/complaint/${complaint.id}`}
              className="text-blue-600 text-xl font-semibold hover:underline"
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
            <p className="mt-2">{complaint.description}</p>
            <p className="mt-2 text-sm">
              Estado:{" "}
              {complaint.resolved ? (
                <span className="text-green-600 font-semibold">Resuelto</span>
              ) : (
                <span className="text-red-600 font-semibold">Pendiente</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}