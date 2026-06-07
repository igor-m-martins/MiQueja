import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { buildUrl } from "../utils/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) {
        setError("Debes estar logado para ver notificaciones.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(buildUrl("notifications"), { credentials: "include" });

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
  }, [user]);

  async function handleNotificationClick(notification) {
    try {
      await fetch(buildUrl("notifications/read"), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: notification.id }),
      });
    } catch (err) {
      // ignore errors; still navigate to the post
    }

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read: 1 } : n
      )
    );

    if (notification.link) {
      window.location.href = notification.link;
    }
  }

  if (loading) return <p className="p-4">Cargando...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (notifications.length === 0) return <p className="p-4">No hay notificaciones.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
      <div className="overflow-y-auto max-h-[72vh] space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-white shadow rounded p-4 border-l-4 border-blue-600"
          >
            <div className="flex justify-between gap-4 items-start">
              <div className="max-w-[calc(100%-3rem)]">
                <a
                  href={n.link || '#'}
                  onClick={(event) => {
                    if (n.link) {
                      event.preventDefault();
                      handleNotificationClick(n);
                    }
                  }}
                  className="font-semibold text-blue-800 hover:underline block"
                >
                  {n.title}
                </a>
                <p className="text-gray-700 mt-2">{n.description || n.message}</p>
              </div>
              {n.read === 0 && (
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-600 mt-1" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}