export const bookingConfig = {
  primary: "whatsapp", // luego "platform"

  whatsapp: {
    number: "506XXXXXXXX",
    message: "Hola, quiero agendar una sesión en PsicoClinicas",
  },

  platform: {
    url: "https://app.psicoclinicas.com",
  },
};

export function getPrimaryLink() {
  if (bookingConfig.primary === "whatsapp") {
    const { number, message } = bookingConfig.whatsapp;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  return bookingConfig.platform.url;
}