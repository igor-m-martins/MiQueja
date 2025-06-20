import { Link } from "react-router-dom";

const complaints = [
  {
    id: "1",
    company: { id: "comunika", name: "Comunika" },
    title: "Problemas con el servicio de internet",
    description: "El internet se cae constantemente y no recibo solución.",
    resolved: true,
  },
  {
    id: "2",
    company: { id: "electrosur", name: "ElectroSur" },
    title: "Cobro excesivo en factura",
    description: "Me cobraron un monto que no corresponde en la última factura de electricidad.",
    resolved: false,
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quejas recientes</h1>
      <ul className="space-y-4">
        {complaints.map((complaint) => (
          <li
            key={complaint.id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >

            <Link
              to={`/company/${complaint.company.id}`}
              className="text-blue-600 font-semibold"
            >
              {complaint.company.name}
            </Link>
            <Link
              to={`/complaint-detail/${complaint.id}`}
              className="text-black no-underline hover:text-blue-600"
            >
              <h2 className="text-xl font-semibold mt-2">{complaint.title}</h2>
              <p className="mt-1">{complaint.description}</p>
              <p className="mt-2 text-sm">
                Estado:{" "}
                {complaint.resolved ? (
                  <span className="text-green-600 font-semibold">Resuelto</span>
                ) : (
                  <span className="text-red-600 font-semibold">Pendiente</span>
                )}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
