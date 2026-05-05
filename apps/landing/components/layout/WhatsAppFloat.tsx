import { getWhatsAppLink } from "@/config/booking";

export default function WhatsAppFloat() {
  const link = getWhatsAppLink("Hola, quisiera información sobre terapia");

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[var(--primary)] text-white px-5 py-3 rounded-full shadow-lg"
    >
      ¿Hablamos?
    </a>
  );
}