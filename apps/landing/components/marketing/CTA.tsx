import Link from "next/link";
import { getPrimaryLink } from "@/config/booking";

export default function CTA() {
  const link = getPrimaryLink();

  return (
    <section className="py-20 px-6 text-center bg-white">
      <div className="max-w-3xl mx-auto">

        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Agenda tu primera sesión hoy
        </h2>

        <p className="text-[var(--text-soft)] mb-6">
          Da el primer paso hacia tu bienestar emocional
        </p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-3 rounded-xl text-lg transition shadow-sm"
        >
          Agendar por WhatsApp
        </a>

      </div>
    </section>
  );
}