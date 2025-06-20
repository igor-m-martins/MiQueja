import { useParams, Link } from "react-router-dom";

const companiesMock = {
  electrosur: {
    name: "ElectroSur",
    complaints: [
      {
        id: "1",
        title: "Cobro excesivo en factura",
        description: "Me cobraron un monto que no corresponde en la última factura de electricidad.",
        resolved: false,
      },
    ],
  },
  comunika: {
    name: "Comunika",
    complaints: [
      {
        id: "2",
        title: "Problemas con el servicio de internet",
        description: "El internet se cae constantemente y no recibo solución.",
        resolved: true,
      },
    ],
  },
};

export default function Empresa() {
  const { id } = useParams();
  const company = companiesMock[id];

  if (!company) {
    return <p>Empresa no encontrada.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{company.name}</h1>
      <h2 className="text-xl font-semibold mb-4">Quejas registradas</h2>

      {company.complaints.length === 0 && (
        <p>No hay quejas para esta empresa.</p>
      )}
      <ul className="space-y-4">
        {company.complaints.map((complaint) => (
          <li
            key={complaint.id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">{complaint.title}</h3>
            <p className="mt-1">{complaint.description}</p>
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

      <Link
        to="/new-complaint"
        className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Nueva Queja
      </Link>
    </div>
  );
}
