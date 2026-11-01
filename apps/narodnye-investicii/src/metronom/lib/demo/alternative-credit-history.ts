import type { DemoStepId } from "@m/domain/types";

export type AlternativeCreditHistoryStep =
  | "credit_history_unlock"
  | "credit_history_products";

export type AlternativeCreditHistoryProductIcon =
  | "wallet"
  | "lease"
  | "swap"
  | "shield";

export type AlternativeCreditHistoryProduct = {
  name: string;
  description: string;
  reason: string;
  icon: AlternativeCreditHistoryProductIcon;
};

export const ALT_CREDIT_HISTORY_ENTRY: {
  step: DemoStepId;
  kicker: string;
  title: string;
  sub: string;
  button: string;
} = {
  step: "credit_history_unlock",
  kicker: "Открылись новые продукты",
  title: "Цикл пройден — доступен новый статус и четыре продукта банка",
  sub: "Обязательства перед бэкерами закрыты, кризис пережит, оборот растёт третий месяц.",
  button: "Посмотреть",
};

export const ALT_CREDIT_HISTORY_HISTORY_ROWS = [
  { label: "Сборов проведено", value: "1" },
  { label: "Обещаний исполнено", value: "120 из 120" },
  { label: "Кризис пережит", value: "август" },
  { label: "Оборот по счёту растёт", value: "3 месяца" },
];

export const ALT_CREDIT_HISTORY_PRODUCTS: AlternativeCreditHistoryProduct[] = [
  {
    name: "Кредит для бизнеса",
    description: "Деньги на закупки, операционные расходы и рост без нового сбора.",
    reason: "Доступно благодаря истории сборов",
    icon: "wallet",
  },
  {
    name: "Лизинг оборудования",
    description: "Покупка техники и оснащения с оплатой частями на комфортный срок.",
    reason: "Доступно благодаря истории сборов",
    icon: "lease",
  },
  {
    name: "Факторинг",
    description: "Ранний доступ к деньгам по выставленным счетам и будущим поступлениям.",
    reason: "Доступно благодаря обороту по счёту",
    icon: "swap",
  },
  {
    name: "Страхование бизнеса",
    description: "Защита имущества, ответственности и пауз в работе бизнеса.",
    reason: "Доступно благодаря статусу «Надёжный партнёр»",
    icon: "shield",
  },
];

export const ALT_CREDIT_HISTORY_EXPLANATION =
  "История сборов, исполненных обещаний и оборотов заменяет кредитную историю. Скоринг работает на новом источнике данных — там, где раньше был бы отказ.";
