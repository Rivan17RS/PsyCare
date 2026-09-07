export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">

        {/* Main footer content */}
        <div className="flex flex-col items-center text-center gap-6">

          {/* PsicoClinicas */}
          <div>
            <p className="text-base font-semibold text-gray-800">
              PsicoClinicas
            </p>

            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Psicoterapia presencial y online • Atención confidencial
            </p>
          </div>

          {/* RivanSoft branding */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-px w-16 bg-gray-200" />

            <img
              src="/branding/rivansoft-logo-dark.png"
              alt="RivanSoft"
              className="w-40 opacity-50 grayscale"
            />

            <p className="text-xs text-gray-400">
              Tecnología desarrollada por RivanSoft
            </p>
          </div>

        </div>

        {/* Legal */}
        <div className="mt-8 border-t border-gray-100 pt-5 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} PsicoClinicas. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}