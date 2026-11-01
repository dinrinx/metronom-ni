import { notFound } from "next/navigation";

// Без этого неизвестные пути под /ni попадали бы в catch-all Метронома.
export default function UnknownNiPage() {
  notFound();
}
