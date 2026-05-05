"use client";

import { useState } from "react";

const services = [
  {
    title: "Ansiedad",
    description:
      "La ansiedad puede sentirse como una preocupación constante, dificultad para relajarte o pensamientos que no se detienen. Es una respuesta natural del cuerpo, pero cuando se vuelve frecuente puede afectar tu día a día.",
  },
  {
    title: "Estrés",
    description:
      "El estrés aparece cuando sientes que las demandas superan tus recursos. Puede manifestarse con tensión, irritabilidad o agotamiento mental. Aprender a gestionarlo es clave para tu bienestar.",
  },
  {
    title: "Relaciones",
    description:
      "Las relaciones pueden generar conflicto, distancia emocional o dificultad para comunicarse. Trabajar estos aspectos permite construir vínculos más sanos y satisfactorios.",
  },
  {
    title: "Burnout",
    description:
      "El burnout es un agotamiento profundo relacionado con el trabajo o responsabilidades constantes. Puede incluir cansancio extremo, falta de motivación y sensación de estar sobrepasado.",
  },
  {
    title: "Autoestima",
    description:
      "La autoestima influye en cómo te percibes y en tus decisiones. Dificultades en esta área pueden llevar a inseguridad, autocrítica excesiva o dificultad para poner límites.",
  },
  {
    title: "Madre Primeriza",
    description:
      "Convertirse en madre por primera vez puede generar emociones intensas: alegría, miedo, dudas o agotamiento. Es un proceso de adaptación donde el acompañamiento emocional es clave.",
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="servicios" className="py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-3xl font-semibold mb-10">
          Áreas en las que puedo ayudarte
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={item.title}
                onClick={() =>
                  setActiveIndex(isActive ? null : index)
                }
                className={`cursor-pointer p-6 rounded-xl border transition text-left ${
                  isActive
                    ? "bg-white shadow-md border-[var(--primary)]"
                    : "bg-white hover:shadow-sm"
                }`}
              >
                <p className="font-medium mb-2">
                  {item.title}
                </p>

                {isActive && (
                  <p className="text-[var(--text-soft)] text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}