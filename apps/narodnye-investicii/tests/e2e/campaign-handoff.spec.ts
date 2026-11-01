import { expect, test } from "@playwright/test";
import { createInitialState } from "../../src/metronom/lib/demo/fixtures";
import { formatMoney } from "../../src/metronom/lib/formatting";

test("closing a campaign in НИ reserves backer rewards on the Metronom home screen", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });

  // Выбираем профиль HoReCa в самом НИ, без подмены localStorage.
  await page.goto("/ni/dashboard");
  await page.getByRole("button", { name: "Понятно" }).click();
  await page.getByRole("button", { name: "HoReCa" }).click();
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("kontur-doveria-state") ?? "{}").activeProfileId))
    .toBe("horeca");

  await page.goto("/ni/campaigns/horeca-campaign-1");
  await page.getByRole("button", { name: "Отметить сбор успешным" }).click();
  await page.waitForURL("**/campaign-handoff");

  await expect(page.getByRole("heading", { name: /Сбор «.+» закрыт\. Пришло/ })).toBeVisible();
  const confirm = page.getByRole("button", { name: "Подтвердить и зарезервировать" });
  await expect(confirm).toBeDisabled();

  // Количество приходит из числа бэкеров (2), поэтому на каждую награду остаются срок и себестоимость.
  const deadlines = page.getByLabel("До какой даты");
  const costs = page.getByLabel("Себестоимость за штуку, ₽");
  await expect(page.getByLabel("Сколько штук")).toHaveCount(0);
  await expect(deadlines).toHaveCount(2);

  // Заполненная награда становится подтверждённой, и её поля исчезают.
  await deadlines.first().fill("2026-09-01");
  await costs.first().fill("500");
  await expect(deadlines).toHaveCount(1);
  await expect(confirm).toBeDisabled();

  const initial = createInitialState("horeca");
  const oldBackers = initial.obligations.find((item) => item.id === "backers")?.amount ?? 0;
  const expectedBackers = 2 * 500 + 2 * 300;
  const expectedSafe = initial.currentAccountsTotal - (initial.committedTotal - oldBackers + expectedBackers);

  await deadlines.first().fill("2026-09-15");
  await costs.first().fill("300");

  await expect(page.getByTestId("handoff-safe-to-spend")).toHaveText(formatMoney(expectedSafe));
  await expect(confirm).toBeEnabled();
  await confirm.click();

  await expect(page).toHaveURL(/\/safe-to-spend$/);
  await expect(page.locator(".free-amount")).toHaveText(formatMoney(expectedSafe));
  await expect(page.getByTestId("live-envelopes-stack")).toContainText(formatMoney(expectedBackers));
  await expect(page.getByText(`из них кампания «Народные инвестиции» — ${formatMoney(expectedBackers)}`)).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("handoff:campaign-closed"))).toBeNull();
});

test("the site root opens НИ first, Метроном has its own entry", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/ni(\/|$)/);
  await page.goto("/metronom");
  await expect(page.getByText("Выбери профиль")).toBeVisible();
});
