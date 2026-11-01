export interface LegalCard {
  id: string;
  category: string;
  question: string;
  answer: string;
  updatedDate: string;
  verifiedDate: string;
  sourceUrl: string;
  sourceLabel: string;
  keywords: string[];
  frequent?: boolean;
}

export const LEGAL_CARDS: LegalCard[] = [
  {
    id: "beauty-license",
    category: "Бьюти",
    question: "Нужна ли лицензия на уколы и лазер?",
    answer:
      "Да. Инъекционные и аппаратные процедуры (уколы, лазерная эпиляция) — медицинская деятельность, для неё нужна медлицензия и сертифицированный специалист. Кассы недостаточно, чтобы легализовать такие услуги.",
    updatedDate: "2026-06-01",
    verifiedDate: "2026-06-01",
    sourceUrl: "https://roszdravnadzor.gov.ru",
    sourceLabel: "Росздравнадзор",
    keywords: ["лицензия", "уколы", "лазер", "медицина", "бьюти", "инъекции"],
    frequent: true,
  },
  {
    id: "cashbox-required",
    category: "Касса",
    question: "Обязательна ли онлайн-касса при приёме с телефона?",
    answer:
      "Да. Приём оплаты от физлиц требует онлайн-кассы независимо от способа приёма — телефон заменяет терминал, но не саму кассу и обязанность пробивать чек.",
    updatedDate: "2026-05-20",
    verifiedDate: "2026-05-20",
    sourceUrl: "https://www.nalog.gov.ru",
    sourceLabel: "ФНС России",
    keywords: ["касса", "онлайн-касса", "телефон", "чек", "эквайринг"],
    frequent: true,
  },
  {
    id: "donation-tax",
    category: "Налоги",
    question: "Как считать налог с донатов через Народные инвестиции?",
    answer:
      "Донат с бонусом донатеру — по сути предоплата за товар или услугу, а не безвозмездная помощь. Он облагается как обычная выручка по твоей системе налогообложения.",
    updatedDate: "2026-04-15",
    verifiedDate: "2026-04-15",
    sourceUrl: "https://www.nalog.gov.ru",
    sourceLabel: "ФНС России",
    keywords: ["налог", "донат", "народные инвестиции", "выручка"],
    frequent: true,
  },
  {
    id: "horeca-rospotreb",
    category: "HoReCa",
    question: "Нужен ли Роспотребнадзор для фудтрака?",
    answer:
      "Да. Для передвижной точки питания нужно уведомление в Роспотребнадзор и соблюдение СанПиН — это не зависит от того, есть ли у тебя касса или онлайн-приём оплаты.",
    updatedDate: "2026-03-10",
    verifiedDate: "2026-03-10",
    sourceUrl: "https://www.rospotrebnadzor.ru",
    sourceLabel: "Роспотребнадзор",
    keywords: ["фудтрак", "роспотребнадзор", "санпин", "horeca", "общепит"],
  },
  {
    id: "retail-marking",
    category: "Розница",
    question: "Нужна ли маркировка товаров вне маркетплейса?",
    answer:
      "Да. Обязательная маркировка «Честный знак» действует независимо от канала продаж — уход с маркетплейса на прямые продажи не освобождает от неё.",
    updatedDate: "2026-02-18",
    verifiedDate: "2026-02-18",
    sourceUrl: "https://честныйзнак.рф",
    sourceLabel: "Честный знак",
    keywords: ["маркировка", "честный знак", "розница", "маркетплейс"],
  },
  {
    id: "self-employed-sbp",
    category: "Самозанятость",
    question: "Можно ли принимать переводы как самозанятый через СБП?",
    answer:
      "Да, но каждый перевод нужно пробить чеком в приложении «Мой налог» в течение суток. Без чека есть риск, что доход переквалифицируют в незаконную предпринимательскую деятельность.",
    updatedDate: "2026-05-02",
    verifiedDate: "2026-05-02",
    sourceUrl: "https://npd.nalog.ru",
    sourceLabel: "Мой налог",
    keywords: ["самозанятый", "сбп", "чек", "мой налог", "перевод"],
    frequent: true,
  },
];

export const LEGAL_CATEGORIES = Array.from(new Set(LEGAL_CARDS.map((c) => c.category)));
