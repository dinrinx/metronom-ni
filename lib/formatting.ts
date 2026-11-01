import type { Money } from "@/domain/types";

const moneyFormatter = new Intl.NumberFormat("ru-RU");

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const compactDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const compactDateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatMoney(amount: Money): string {
  return `${moneyFormatter.format(amount)} ₽`;
}

export function formatRuDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00.000Z`));
}

export function formatCompactRuDate(isoDate: string): string {
  return compactDateFormatter.format(new Date(`${isoDate}T00:00:00.000Z`));
}

export function formatCompactRuDateTime(isoDateTime: string): string {
  return compactDateTimeFormatter.format(new Date(isoDateTime));
}

export function isoDay(isoDateTime: string): string {
  return isoDateTime.slice(0, 10);
}
