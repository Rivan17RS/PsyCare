import Image from "next/image";
import Link from "next/link";

export default function Platform() {
  return (
    <section id="plataforma" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Description */}
        <div>

          <h2 className="text-3xl font-semibold mb-4">
            Una experiencia más completa
          </h2>

          <p className="text-[var(--text-soft)] mb-6">
            Gestiona tus citas, da seguimiento a tu proceso y accede a tu
            información en un solo lugar.
          </p>

          <Link
            href="/plataforma"
            className="inline-block border border-[var(--primary)] text-[var(--primary)] px-6 py-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition"
          >
            Conocer la plataforma
          </Link>

        </div>

        {/* Image */}
        <div className="relative">

          <div className="absolute -inset-2 bg-[var(--primary)] opacity-10 blur-xl rounded-2xl"></div>

          <Image
            src="/landing_laptop_calendar.png"
            alt="Plataforma de psicología"
            width={600}
            height={500}
            className="relative rounded-2xl shadow-lg object-cover w-full h-auto"
          />

        </div>

      </div>
    </section>
  );
}