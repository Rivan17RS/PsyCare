export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">

          {/* PsicoClinicas */}
          <div>
            <p className="text-lg font-semibold text-gray-800">
              PsicoClinicas
            </p>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-soft)]">
              Psicoterapia online y atención confidencial para acompañarte
              en cada etapa de tu bienestar emocional.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Explora
            </h3>

            <nav className="mt-3 flex flex-col gap-2">
              <a
                href="#servicios"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Servicios
              </a>

              <a
                href="#como-funciona"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Cómo funciona
              </a>

              <a
                href="#agendar"
                className="w-fit text-sm text-gray-500 transition-colors hover:text-gray-800"
              >
                Agendar
              </a>
            </nav>
          </div>

          {/* RivanSoft */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Plataforma
            </h3>

            <div className="mt-3 flex items-start gap-4">
              <img
                src="/branding/rivansoft-logo-dark.png"
                alt="RivanSoft"
                className="w-36 opacity-45 grayscale"
              />

              <p className="text-xs leading-5 text-gray-400">
                Tecnología desarrollada por RivanSoft.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-2 border-t border-gray-100 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} PsicoClinicas. Todos los derechos
            reservados.
          </p>

          <p>
            Desarrollado por RivanSoft
          </p>
        </div>
      </div>
    </footer>
  );
}