import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewComplaint() {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Queja enviada:\nEmpresa: ${company}\nTítulo: ${title}`);
    setCompany("");
    setTitle("");
    setDescription("");
    navigate("/");
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Nueva queja</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Empresa:
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Nombre de la empresa"
          />
        </label>
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
        <label className="block">
          Descripción:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Detalle de la queja"
            rows={5}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar queja
        </button>
      </form>
    </div>
  );
}
