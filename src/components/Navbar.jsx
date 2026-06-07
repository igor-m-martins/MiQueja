import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoIcon from "../img/icon.png";
import { buildUrl } from "../utils/api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const closeTimeout = useRef(null);
  const containerRef = useRef(null);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const openMenu = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(true);
  };

  const closeMenu = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
      closeTimeout.current = null;
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!containerRef.current) return;
      if (open && !containerRef.current.contains(e.target)) {
        if (closeTimeout.current) {
          clearTimeout(closeTimeout.current);
          closeTimeout.current = null;
        }
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!user?.id) {
      setHasNewNotifications(false);
      return;
    }

    const checkNotifications = async () => {
      try {
        const response = await fetch(buildUrl(`notifications/check?user_id=${user.id}`), { credentials: "include" });
        if (!response.ok) return;

        const data = await response.json().catch(() => ({}));
        const hasNew =
          data.hasNewNotification ||
          data.has_new_notifications ||
          data.has_new_notification ||
          data.newNotification ||
          data.new_notification ||
          (typeof data.unreadCount === "number" ? data.unreadCount > 0 : false) ||
          (Array.isArray(data) && data.length > 0);

        setHasNewNotifications(Boolean(hasNew));
      } catch (e) {
        // ignore polling errors
      }
    };

    checkNotifications();
    const intervalId = setInterval(checkNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [user?.id]);

  return (
    <nav ref={containerRef} className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center border-b border-slate-800">
      <Link to="/" className="flex items-center">
        <img 
          src={logoIcon} 
          alt="MiQueja Logo" 
          className="h-8 w-auto object-contain" 
        />
      <span className="sr-only">MiQueja</span>
    </Link>
      
      <div className="flex items-center gap-3">
        {user?.type !== "company" && (
          <Link to="/new-complaint" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition whitespace-nowrap">
            Publicar Queja
          </Link>
        )}

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {user.type === "company" ? (
                <Link to="/dashboard" className="text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-1.5 rounded-md transition-colors">
                  Panel de Control
                </Link>
              ) : (
                <Link to="/advertisers" className="text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-1.5 rounded-md transition-colors">
                  Anunciantes
                </Link>
              )}
              <Link to="/notifications" className="relative text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-1.5 rounded-md transition-colors">
                Notificaciones
                {hasNewNotifications && (
                  <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 inline-flex h-2 w-2 rounded-full bg-red-600" />
                )}
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-1.5 rounded-md transition-colors"
                  aria-expanded={userMenuOpen}
                >
                  {user.name || user.fullname || user.username}
                </button>
                <div
                  className={`absolute ${userMenuOpen ? "block" : "hidden"} bg-white text-black mt-2 rounded shadow p-2 right-0 z-10`}
                >
                  {user.type === "user" && (
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Perfil
                    </Link>
                  )}
                  {user.type === "company" && (
                    <Link
                      to={`/company/${user.id}`}
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Perfil
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/advertisers" className="text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-1.5 rounded-md transition-colors">
                  Anunciantes
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                Iniciar Sesión
              </Link>
              <Link to="/register" className="text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-1.5 rounded-md transition-colors">
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded border border-white/30 hover:bg-white/10"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label="Abrir menu móvil"
        >
          <span className="block h-0.5 w-5 bg-white mb-1" />
          <span className="block h-0.5 w-5 bg-white mb-1" />
          <span className="block h-0.5 w-5 bg-white" />
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-30 w-64 max-w-xs bg-white text-black shadow-2xl md:hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="font-semibold">Menu</span>
              <button
                type="button"
                className="text-slate-600 hover:text-slate-900"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menu"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col p-2 gap-2">
              {user ? (
                <>
                  {user.type === "company" ? (
                    <Link
                      to="/dashboard"
                      className="px-4 py-3 rounded hover:bg-slate-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      Panel de Control
                    </Link>
                  ) : (
                    <Link
                      to="/advertisers"
                      className="px-4 py-3 rounded hover:bg-slate-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      Anunciantes
                    </Link>
                  )}
                  <Link
                    to="/notifications"
                    className="px-4 py-3 rounded hover:bg-slate-100 relative"
                    onClick={() => setMobileOpen(false)}
                  >
                    Notificaciones
                    {hasNewNotifications && (
                      <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-600" />
                    )}
                  </Link>
                  <Link
                    to={user.type === "company" ? `/company/${user.id}` : "/perfil"}
                    className="px-4 py-3 rounded hover:bg-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="text-left px-4 py-3 rounded hover:bg-slate-100"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-3 rounded hover:bg-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 rounded hover:bg-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
