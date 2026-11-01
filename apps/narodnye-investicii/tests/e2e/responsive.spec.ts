import { expect, test } from "@playwright/test";
import { reachSafeToSpend } from "./helpers";

test("canonical HoReCa flow fits 375x812 without horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await reachSafeToSpend(page, "Кофейня «На колёсах»");

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
  await expect(page.getByText("86 000 ₽")).toBeVisible();
});

test("canonical HoReCa flow fits 430x932 without horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await reachSafeToSpend(page, "Кофейня «На колёсах»");

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
  await expect(page.getByText("86 000 ₽")).toBeVisible();
});
