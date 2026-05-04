import { getPrimaryLink } from "@/config/booking";

export default function WhatsAppFloat() {
  const link = getPrimaryLink();

  return (
    <a
      href={link}
      target="_blank"
      className="fixed bottom-6 right-6 z-50 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-5 py-3 rounded-full shadow-lg text-sm transition"
    >
      Ayuda por WhatsApp
    </a>
  );
}