import { expect, test } from "@playwright/test";
import { completeP0Flow } from "./helpers";

test("horeca canonical flow reaches logical reserve without real transfer", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await completeP0Flow(page, "Кофейня «На колёсах»");
  await expect(page.getByText("Резерв учитывается только логически, без реального перевода.")).toBeVisible();
  await expect(page.getByText("86 000 ₽")).toBeVisible();
});

test("beauty smoke flow works with the same scenario engine", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await completeP0Flow(page, "Beauty-студия");
  await expect(page.getByRole("heading", { name: "Правило активно" })).toBeVisible();
});

test("retail smoke flow works with the same scenario engine", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await completeP0Flow(page, "Небольшая розница");
  await expect(page.getByRole("heading", { name: "Правило активно" })).toBeVisible();
});

test("progress persists after refresh on the canonical HoReCa flow", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await completeP0Flow(page, "Кофейня «На колёсах»");
  await page.reload();
  await expect(page.getByText("Правило активно")).toBeVisible();
});
