export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-[var(--background)]">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-3xl font-semibold mb-10">
          ¿Cómo funciona?
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* WhatsApp */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold mb-4">
              WhatsApp (rápido)
            </h3>

            <div className="text-[var(--text-soft)] space-y-1">
              <p>1. Escribes</p>
              <p>2. Coordinamos horario</p>
              <p>3. Tienes tu sesión</p>
            </div>
          </div>

          {/* Plataforma */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold mb-4">
              Plataforma PsicoClinicas
            </h3>

            <div className="text-[var(--text-soft)] space-y-1">
              <p>1. Accedes a tu espacio</p>
              <p>2. Gestionas tus citas</p>
              <p>3. Das seguimiento a tu proceso</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}