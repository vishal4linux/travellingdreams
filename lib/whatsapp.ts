import { SITE } from "@/lib/constants/site";

export function getWhatsAppNumber(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
    process.env.WHATSAPP_NUMBER ??
    ""
  );
}

export function buildWhatsAppUrl(message?: string): string {
  const number = getWhatsAppNumber();
  if (!number) return "#";
  const text = encodeURIComponent(message ?? SITE.whatsappMessageDefault);
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${text}`;
}
