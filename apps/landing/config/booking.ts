export const bookingConfig = {
  primary: "whatsapp", // luego "platform"

  whatsapp: {
    number: "50683610506",
    defaultMessage: "Hola, quiero agendar una sesión en PsicoClinicas",
  },

  platform: {
    url: "https://app.psicoclinicas.com",
  },
};

// Link base 
export function getPrimaryLink(customMessage?: string) {
  if (bookingConfig.primary === "whatsapp") {
    return getWhatsAppLink(customMessage);
  }

  return bookingConfig.platform.url;
}

// WhatsApp helper (reusable)
export function getWhatsAppLink(customMessage?: string) {
  const { number, defaultMessage } = bookingConfig.whatsapp;

  const message = customMessage || defaultMessage;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}