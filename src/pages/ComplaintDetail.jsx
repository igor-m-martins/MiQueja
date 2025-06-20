import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function ComplaintDetail() {
  const { id } = useParams(); // Usa o id passado via GET

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const response = await fetch(`http://127.0.0.1:2222/complaints/${id}`);
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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!complaint) return <p>Queja no encontrada.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-4">{complaint.title}</h1>
      <h2 className="text-xl font-semibold mb-2 text-blue-600">
        Empresa: <Link to={`/company/${complaint.company.id}`} className="text-blue-600 font-semibold">{complaint.company.name}</Link>
      </h2>

      <section className="mb-6">
        <h3 className="font-semibold text-lg mb-1">Descripción de la queja</h3>
        <p>{complaint.description}</p>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-lg mb-1">Respuesta de la empresa</h3>
        <p>{complaint.response}</p>
      </section>

      <p className="text-sm">
        Estado:{" "}
        {complaint.resolved ? (
          <span className="text-green-600 font-semibold">Resuelto</span>
        ) : (
          <span className="text-red-600 font-semibold">Pendiente</span>
        )}
      </p>
    </div>
  );
}
