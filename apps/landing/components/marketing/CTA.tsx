import Image from "next/image";
import { getPrimaryLink } from "@/config/booking";

export default function CTA() {
  const link = getPrimaryLink();

  return (
    <section className="py-20 px-6 bg-[var(--background)]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Image */}
        <div className="relative">
          <div className="absolute -inset-2 bg-[var(--primary)] opacity-10 blur-xl rounded-2xl"></div>

          <Image
            src="/landing_psychotherapy_group.png"
            alt="Sesión de terapia"
            width={600}
            height={500}
            className="relative rounded-2xl shadow-lg object-cover w-full h-auto"
          />
        </div>

        {/* Description */}
        <div className="text-center md:text-left">

          <h2 className="text-3xl font-semibold mb-4">
            Da el primer paso hoy
          </h2>

          <p className="text-[var(--text-soft)] mb-6">
            Hablar con un profesional puede ayudarte a entender lo que estás
            sintiendo y encontrar herramientas para sentirte mejor.
          </p>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-3 rounded-xl text-lg transition"
          >
            Hablar por WhatsApp
          </a>

        </div>

      </div>
    </section>
  );
}