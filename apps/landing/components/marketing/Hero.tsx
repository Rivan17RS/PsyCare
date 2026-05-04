import Image from "next/image";
import Link from "next/link";
import { getPrimaryLink } from "@/config/booking";

export default function Hero() {
  const link = getPrimaryLink();

  return (
    <section className="py-20 px-6 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        <div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Psicoterapia online para sentirte mejor, paso a paso
          </h1>

          <p className="text-lg text-[var(--text-soft)] mb-8">
            Acompañamiento profesional para ansiedad, estrés y bienestar emocional
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={link}
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-3 rounded-xl text-lg transition"
            >
              Agendar sesión
            </Link>

            <Link
              href="/test"
              className="border px-6 py-3 rounded-xl text-lg"
            >
              Realizar test
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Atención confidencial • Sesiones online
          </p>

        </div>

        {/* Image */}
        <div className="relative">

          <div className="absolute -inset-2 bg-[var(--primary)] opacity-10 rounded-2xl blur-xl"></div>

          <Image
            src="/backgrnd_img_hero.png"
            alt="Psicoterapia online"
            width={600}
            height={500}
            className="relative rounded-2xl shadow-lg object-cover w-full h-auto"
            priority
          />

        </div>

      </div>
    </section>
  );
}