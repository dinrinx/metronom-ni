export interface PaymentProduct {
  name: string;
  description: string;
  glyph: string;
}

export const PAYMENT_PRODUCTS: PaymentProduct[] = [
  { name: "Альфа-Касса", description: "Онлайн-касса для приёма оплаты по 54-ФЗ", glyph: "🧾" },
  { name: "Приём оплаты с телефона", description: "Принимай карты без отдельного терминала", glyph: "📱" },
  { name: "СБП без эквайринга", description: "Переводы от клиентов без комиссии за эквайринг", glyph: "🔁" },
  { name: "Alfa Pay", description: "Приём платежей на сайте и в соцсетях", glyph: "💳" },
  { name: "Облачная касса", description: "Учёт номенклатуры без привязки к точке продаж", glyph: "☁️" },
];
