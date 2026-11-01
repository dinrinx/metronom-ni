import type { RiskLevel } from "@/types";

export interface Tariff {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export const TARIFFS: Tariff[] = [
  {
    id: "start",
    name: "Старт",
    price: "0 ₽/мес",
    features: ["До 10 операций в месяц без комиссии", "Базовая аналитика счёта"],
  },
  {
    id: "business",
    name: "Бизнес",
    price: "990 ₽/мес",
    features: ["Безлимитные переводы физлицам", "Приоритетная поддержка", "Доступ к Народным инвестициям"],
  },
  {
    id: "pro",
    name: "Профи",
    price: "2 490 ₽/мес",
    features: ["Кэшбэк на обороты по счёту", "Персональный менеджер", "Расширенная AI-аналитика"],
  },
];

export function recommendedTariffId(risk: RiskLevel | undefined): string {
  if (risk === "low") return "pro";
  if (risk === "medium") return "business";
  return "start";
}
