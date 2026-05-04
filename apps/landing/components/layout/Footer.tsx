export default function Footer() {
  return (
    <footer className="border-t mt-20 py-10 px-6 text-center text-sm">

      <div className="max-w-4xl mx-auto">

        <p className="font-medium mb-2">
          PsicoClinicas
        </p>

        <p className="text-[var(--text-soft)] mb-4">
          Psicoterapia online • Atención confidencial
        </p>

        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} PsicoClinicas. Todos los derechos reservados.
        </p>

      </div>

    </footer>
  );
}