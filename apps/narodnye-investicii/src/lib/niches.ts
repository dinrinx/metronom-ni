import type { IndustryId } from "@/types";

export interface NicheMeta {
  id: IndustryId;
  label: string;
  glyph: string;
  badgeBg: string;
}

export const NICHES: NicheMeta[] = [
  { id: "beauty", label: "Бьюти", glyph: "✨", badgeBg: "bg-[#F6E3DD]" },
  { id: "horeca", label: "HoReCa", glyph: "☕", badgeBg: "bg-[#EDE7F6]" },
  { id: "retail", label: "Розница", glyph: "🛍️", badgeBg: "bg-[#DCEBF7]" },
];

export interface NicheRecommendation {
  heading: string;
  products: { name: string; solid?: boolean; glyph?: string }[];
  body: string;
}

export const NICHE_RECOMMENDATIONS: Record<IndustryId, NicheRecommendation> = {
  beauty: {
    heading: "Альфа-Касса + приём с телефона",
    products: [{ name: "Альфа-Касса", solid: true }, { name: "Приём оплаты с телефона", glyph: "📱" }],
    body: "В бьюти чаще всего платят картой прямо в кресле мастера — без кассы это касса «в тени». Альфа-Касса легализует расчёты, а приём с телефона убирает терминал из бюджета первого месяца.",
  },
  horeca: {
    heading: "Приём с телефона + СБП без эквайринга",
    products: [{ name: "Приём оплаты с телефона", glyph: "📱" }, { name: "СБП без эквайринга", solid: true }],
    body: "В фудтраке важна скорость расчёта на месте: приём с телефона работает без терминала, а СБП без эквайринга убирает комиссию с каждого перевода в мобильном потоке.",
  },
  retail: {
    heading: "Облачная касса + Alfa Pay",
    products: [{ name: "Облачная касса", solid: true }, { name: "Alfa Pay", glyph: "💳" }],
    body: "После ухода с маркетплейса нужен свой канал приёма оплаты и учёта: облачная касса ведёт номенклатуру без привязки к одной точке продаж, а Alfa Pay принимает платежи с сайта и соцсетей.",
  },
};
