import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("https://eliteworldwidecompany/miqueja/api/notifications", {
          credentials: "include",
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Error al cargar las notificaciones");
        }

        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  if (loading) return <p className="p-4">Cargando...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (notifications.length === 0) return <p className="p-4">No hay notificaciones.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
      <ul className="space-y-4">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="bg-white shadow rounded p-4 border-l-4 border-blue-600"
          >
            <h2 className="font-semibold text-blue-800">{n.title}</h2>
            <p className="text-gray-700">{n.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}