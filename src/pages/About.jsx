import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      {/* Main header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Sobre <span className="text-blue-600">MiQueja</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Una plataforma cívica, abierta y gratuita creada para transformar la relación entre los consumidores y las empresas en Uruguay, con el propósito de construir confianza a través de la transparencia.
        </p>
      </div>

      {/* Main section: what it is */}
      <div className="bg-white rounded-3xl shadow-md p-8 md:p-10 border border-gray-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">¿Qué es MiQueja?</h2>
        <p className="text-gray-600 leading-relaxed text-base">
          MiQueja es el espacio que materializa la soberanía del consumidor, diseñado para que cualquier ciudadano ejerza su poder de elección y fiscalización al publicar reclamos sobre empresas públicas y privadas que operan en el país. Creemos que el mercado funciona como un plebiscito diario y que la voz del consumidor tiene el poder de dictar el rumbo de cualquier negocio; por eso, la publicidad de los problemas es el primer paso para su resolución.
        </p>
        
        {/* Goals / purpose */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-bold text-lg text-slate-800">Para Consumidores</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Un canal directo, simple y accesible para exponer situaciones injustas, buscar soluciones y alertar a la comunidad.
            </p>
          </div>
          
          <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-bold text-lg text-slate-800">Para Empresas</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              La oportunidad de escuchar activamente a sus clientes, responder de forma transparente y demostrar su compromiso con la mejora continua.
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy and community */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm md:col-span-2 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Filosofía Abierta y Comunitaria</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Este proyecto nació con un fuerte espíritu comunitario. Fomentamos la participación de ciudadanos, ONGs y entidades de defesa del consumidor. Creemos en un ecosistema donde la transparencia impulse mejores servicios para todos los uruguayos.
          </p>
        </div>

        <div className="bg-blue-50/60 rounded-3xl p-6 border border-blue-100 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-blue-900 mb-1">¿Tienes una idea?</h2>
            <p className="text-blue-950/80 text-xs leading-relaxed">
              Las sugerencias y colaboraciones de la comunidad siempre son bienvenidas para seguir construyendo una herramienta más robusta.
            </p>
          </div>
          <div className="mt-4 pt-2">
            <span className="text-xs font-semibold text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full">
              Proyecto Colaborativo
            </span>
          </div>
        </div>
      </div>

      {/* Call to action (CTA) */}
      <div className="text-center bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 md:p-12 text-white shadow-lg space-y-4">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">¿Tienes un problema que resolver?</h2>
        <p className="text-blue-200/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          No te quedes callado. Registra tu reclamo hoy mismo de forma totalmente gratuita y ayúdanos a construir un mercado más justo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/new-complaint"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow hover:bg-blue-700 transition"
          >
            Reportar nueva queja
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
          >
            Ver reclamos recientes
          </Link>
        </div>
      </div>
    </div>
  );
}