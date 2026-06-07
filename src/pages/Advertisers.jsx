import { useState, useEffect } from "react";
import { buildUrl } from "../utils/api";

export default function Advertisers() {
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contact form state
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // Fetch advertisers from the backend
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(buildUrl("advertisers"), {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar anunciantes del servidor");
        return res.json();
      })
      .then((data) => {
        setAdvertisers(data.advertisers || data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los anunciantes en tiempo real.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Submit contact form
  async function handleContactSubmit(e) {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess("");
    setFormError("");

    try {
      const response = await fetch(buildUrl("advertisers/contact"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el formulario");
      }

      setFormSuccess(result.message);
      setFormData({ company_name: "", email: "", message: "" }); // Clear the form
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  }

  // Local filtering based on the received JSON
  const featuredAdvertisers = advertisers.filter((a) => a.featured);
  const regularAdvertisers = advertisers.filter((a) => !a.featured);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-600 animate-pulse font-medium">Cargando anunciantes oficiales...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      
      {/* Main header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Anunciantes Destacados
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Empresas e iniciativas aliadas que apoyan la transparencia y la resolución de conflictos en nuestra comunidad.
        </p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center text-sm">
          {error}
        </div>
      )}

      {/* SECTION 1: Premium advertisers (featured) */}
      {featuredAdvertisers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-indigo-600 tracking-wide uppercase">
            Socios Premium
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredAdvertisers.map((advertiser) => (
              <div
                key={advertiser.id}
                className="flex flex-col sm:flex-row gap-5 bg-gradient-to-br from-white to-slate-50 border border-indigo-100 rounded-3xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200"
              >
                <img
                  src={advertiser.image}
                  alt={advertiser.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                />
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-800">{advertiser.name}</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        Premium
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-500 tracking-wider uppercase mt-0.5">
                      {advertiser.category}
                    </p>
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                      {advertiser.description}
                    </p>
                  </div>
                  <div>
                    <a
                      href={advertiser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                    >
                      Visitar Sitio Oficial
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Other advertisers (regular) */}
      {regularAdvertisers.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-700 tracking-wide uppercase">
            Más Anunciantes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularAdvertisers.map((advertiser) => (
              <div
                key={advertiser.id}
                className="flex flex-col justify-between bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={advertiser.image}
                      alt={advertiser.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">
                        {advertiser.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {advertiser.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {advertiser.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-50">
                  <a
                    href={advertiser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-slate-100 text-slate-700 font-semibold px-4 py-1.5 rounded-lg hover:bg-slate-200 transition text-xs"
                  >
                    Visitar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Partnership section and contact form for hiring */}
      <div className="grid gap-8 lg:grid-cols-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 lg:p-12 shadow-xl">
        <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
          <span className="bg-indigo-500/20 text-indigo-300 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full self-start">
            Publicidad Oficial
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            ¿Tienes una Empresa o Servicio?
          </h2>
          <p className="text-indigo-200/80 text-sm leading-relaxed">
            Promociona tus servicios directamente a miles de usuarios activos que buscan soluciones legales, soporte técnico o mediación corporativa en MiQueja. 
          </p>
          <div className="text-xs text-indigo-300/60 pt-4">
            O si prefieres, escríbenos directamente a: <span className="text-white font-medium">contacto@miqueja.com.uy</span>
          </div>
        </div>

        {/* Integrated hiring contact form */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8">
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Solicitar información de planes</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-indigo-200 mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900"
                  placeholder="Ej. Tech Latam"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-indigo-200 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900"
                  placeholder="ejemplo@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-indigo-200 mb-1">Cuéntanos sobre tu propuesta o servicio</label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900"
                placeholder="Detalla brevemente qué te gustaría anunciar..."
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition shadow-lg active:scale-[0.99] disabled:opacity-50"
            >
              {formSubmitting ? "Enviando solicitud..." : "Enviar Solicitud de Contratación"}
            </button>

            {/* Form feedback messages */}
            {formSuccess && (
              <p className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 p-3 rounded-xl text-center">
                {formSuccess}
              </p>
            )}
            {formError && (
              <p className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 p-3 rounded-xl text-center">
                {formError}
              </p>
            )}
          </form>
        </div>
      </div>

    </div>
  );
}
