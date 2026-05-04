import Link from "next/link";

export default function Platform() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-3xl font-semibold mb-6">
          Una experiencia más completa
        </h2>

        <p className="text-[var(--text-soft)] max-w-xl mx-auto mb-8">
          Gestiona tus citas, da seguimiento a tu proceso y accede a tu información 
          en un solo lugar.
        </p>

        <Link
          href="/plataforma"
          className="inline-block border border-[var(--primary)] text-[var(--primary)] px-6 py-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition"
        >
          Conocer la plataforma
        </Link>

      </div>
    </section>
  );
}