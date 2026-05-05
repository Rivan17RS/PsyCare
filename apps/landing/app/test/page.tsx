"use client";

import { useState } from "react";
import { getWhatsAppLink } from "@/config/booking";

const anxietyQuestions = [
  "¿Te has sentido nervioso o ansioso?",
  "¿No has podido dejar de preocuparte?",
  "¿Te cuesta relajarte?",
  "¿Te sientes inquieto o incapaz de quedarte quieto?",
  "¿Te irritas fácilmente?",
  "¿Sientes miedo como si algo malo fuera a pasar?",
  "¿Te cuesta controlar tus pensamientos?",
];

const depressionQuestions = [
  "¿Te has sentido triste o sin esperanza?",
  "¿Has perdido interés en actividades que disfrutabas?",
  "¿Te sientes con poca energía?",
  "¿Tienes problemas de sueño?",
  "¿Te cuesta concentrarte?",
  "¿Te sientes mal contigo mismo?",
  "¿Te cuesta tomar decisiones?",
];

const options = [
  { label: "Nunca", value: 0 },
  { label: "Algunos días", value: 1 },
  { label: "Más de la mitad de los días", value: 2 },
  { label: "Casi todos los días", value: 3 },
];

export default function TestPage() {
  const questions = [...anxietyQuestions, ...depressionQuestions];

  function getDepressionMessage(level: string) {
    switch (level) {
        case "mínimo":
        return "Tu estado emocional se encuentra dentro de un rango saludable actualmente.";

        case "leve":
        return "Estás experimentando algunas dificultades emocionales leves que vale la pena observar.";

        case "moderado":
        return "Estás experimentando síntomas emocionales moderados que podrían beneficiarse de apoyo profesional.";

        case "alto":
        return "Estás experimentando síntomas emocionales significativos. Buscar apoyo puede marcar una gran diferencia.";

        default:
        return "";
    }
  }

  function getAnxietyMessage(level: string) {
    switch (level) {
        case "mínimo":
        return "Tus niveles de ansiedad están dentro de lo esperado.";

        case "leve":
        return "Estás experimentando algo de ansiedad, pero es manejable.";

        case "moderado":
        return "Tus niveles de ansiedad podrían estar afectando tu día a día.";

        case "alto":
        return "Estás experimentando niveles elevados de ansiedad que podrían beneficiarse de apoyo psicológico.";

        default:
        return "";
    }
  }  

  const [answers, setAnswers] = useState<(number | undefined)[]>(
    Array(questions.length).fill(undefined)
  );
  const [submitted, setSubmitted] = useState(false);

  // validation
  const isComplete = answers.every((a) => a !== undefined);

  const handleAnswer = (index: number, value: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  // Scores
  const anxietyScore = answers
    .slice(0, anxietyQuestions.length)
    .reduce<number>((a, b) => a + (b ?? 0), 0);

  const depressionScore = answers
    .slice(anxietyQuestions.length)
    .reduce<number>((a, b) => a + (b ?? 0), 0);

  const getLevel = (score: number) => {
    if (score <= 4) return "mínimo";
    if (score <= 9) return "leve";
    if (score <= 14) return "moderado";
    return "alto";
  };

  const anxietyLevel = getLevel(anxietyScore);
  const depressionLevel = getLevel(depressionScore);

  // Progress
  const answeredCount = answers.filter((a) => a !== undefined).length;

  // WhatsApp message
  const message = `
    Hola, hice el test en PsicoClinicas.

    Ansiedad: ${anxietyLevel} (${anxietyScore})
    Estado de ánimo: ${depressionLevel} (${depressionScore})

    Me gustaría agendar una sesión.
    `;

    const whatsappLink = getWhatsAppLink(message);

  return (
    <main className="max-w-2xl mx-auto py-16 px-6">

      <h1 className="text-3xl font-bold mb-6">
        Evaluación de ansiedad y estado de ánimo
      </h1>

      {/* Progress */}
      {!submitted && (
        <p className="text-sm text-[var(--text-soft)] mb-6">
          {answeredCount} / {questions.length} preguntas respondidas
        </p>
      )}

      {!submitted ? (
        <>
          {questions.map((q, i) => (
            <div key={i} className="mb-6">
              <p className="mb-3 font-medium">{q}</p>

              <div className="flex flex-col gap-2">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(i, opt.value)}
                    className={`p-3 rounded-lg border text-left transition ${
                      answers[i] === opt.value
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Message Validation */}
          {!isComplete && (
            <p className="text-sm text-gray-400 mt-2">
              Responde todas las preguntas para ver tus resultados
            </p>
          )}

          {/* Button */}
          <button
            onClick={() => setSubmitted(true)}
            disabled={!isComplete}
            className={`mt-6 px-6 py-3 rounded-xl transition ${
              isComplete
                ? "bg-[var(--primary)] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Ver resultados
          </button>
        </>
      ) : (
        <div className="text-center">

            <h2 className="text-2xl font-semibold mb-6">
                Resultado de tu evaluación
            </h2>

            <p className="text-[var(--text-soft)] mb-6 max-w-xl mx-auto">
                Este test es orientativo y no sustituye una evaluación profesional completa.
                Su objetivo es ayudar, de una manera muy accesible, a observar señales de malestar emocional.
                Entender lo que estás sintiendo es el primer paso para sentirte mejor.
            </p>

            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 text-left">

                <h3 className="font-semibold mb-2">
                Ansiedad
                </h3>

                <p className="text-lg font-medium mb-2">
                Nivel {anxietyLevel} ({anxietyScore})
                </p>

                <p className="text-[var(--text-soft)]">
                {getAnxietyMessage(anxietyLevel)}
                </p>

            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 text-left">

                <h3 className="font-semibold mb-2">
                Estado de ánimo
                </h3>

                <p className="text-lg font-medium mb-2">
                Nivel {depressionLevel} ({depressionScore})
                </p>

                <p className="text-[var(--text-soft)]">
                {getDepressionMessage(depressionLevel)}
                </p>

            </div>

            {(anxietyScore >= 8 || depressionScore >= 8) && (
                <p className="mb-6 max-w-xl mx-auto">
                Buscar apoyo psicológico puede ayudarte a entender mejor lo que estás
                viviendo y encontrar herramientas para mejorar tu bienestar.
                </p>
            )}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-3 rounded-xl inline-block transition"
            >
              Enviar resultados y hablar con un profesional
            </a>

            <p className="text-sm text-gray-400 mt-3">
                Respuesta confidencial • Atención personalizada
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

            <a
                href="/"
                className="px-6 py-3 rounded-xl border text-[var(--text-main)] hover:bg-gray-100 transition"
            >
                Explorar más información
            </a>

            {/* Link al SaaS - actualizar al link del SaaS una vez implementado
            <a
                href="https://app.psicoclinicas.com" //actualizar al link del SaaS una vez implementado
                target="_blank"
                className="px-6 py-3 rounded-xl border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
            >
                Acceder a mi espacio terapéutico
            </a>
            */}
            </div>

        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-gray-400 mt-8">
        Basado en cuestionarios clínicos (GAD-7 y PHQ-9). Uso orientativo.
      </p>

    </main>
  );
}