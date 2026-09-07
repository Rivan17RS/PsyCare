import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          
          {/* Brand */}
          <div className="flex items-start">
            <img
              src="/branding/rivansoft-logo-dark.png"
              alt="RivanSoft"
              className="w-56 opacity-55 grayscale"
            />
          </div>

          {/* Producto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-700">
              Producto
            </h3>

            <nav className="flex flex-col gap-2">

              <Link
                to="/agendar-cita"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Citas
              </Link>

              <Link
                to="/mis-citas"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Mis citas
              </Link>

              <Link
                to="/historial"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Historial
              </Link>
            </nav>
          </div>

          {/* Información */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-700">
              Información
            </h3>

            <nav className="flex flex-col gap-2">
              <a
                href="#"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Centro de ayuda
              </a>

              <a
                href="#"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Privacidad
              </a>

              <a
                href="#"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Términos de uso
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-200 pt-5">
          <div className="flex flex-col gap-2 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
            <div>
              <p>Desarrollado por RivanSoft</p>
              <p className="mt-1">
                © 2026 RivanSoft. Todos los derechos reservados.
              </p>
            </div>

            <span>PsyCare · v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}