import { useState } from "react";

export default function Registro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert(`¡Registro enviado!\nNombre: ${name}\nEmail: ${email}`);
    // Envia os dados ao backend
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Crear una cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Nombre completo:
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Tu nombre completo"
          />
        </label>
        <label className="block">
          Correo electrónico:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="correo@ejemplo.com"
          />
        </label>
        <label className="block">
          Contraseña:
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Mínimo 6 caracteres"
          />
        </label>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
