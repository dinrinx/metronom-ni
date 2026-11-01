import { expect, type Page } from "@playwright/test";
import { demoReducer } from "../../domain/events/reducer";
import { INDUSTRY_PROFILES } from "../../lib/industry/profiles";
import { createInitialState } from "../../lib/demo/fixtures";
import { formatMoney } from "../../lib/formatting";

export const profileMap = {
  "Кофейня «На колёсах»": "horeca",
  "Beauty-студия": "beauty",
  "Небольшая розница": "retail",
} as const;

export async function reachSafeToSpend(page: Page, profileLabel: keyof typeof profileMap) {
  await page.goto("/", { waitUntil: "networkidle" });
  const profileId = profileMap[profileLabel];
  const credentials = INDUSTRY_PROFILES[profileId];
  let expectedState = createInitialState(profileId);
  expectedState = demoReducer(expectedState, { type: "pick_clarification_date", isoDate: "2026-08-18" });
  expectedState = demoReducer(expectedState, { type: "apply_clarification" });
  const expectedFree = formatMoney(expectedState.safeToSpend);

  await page.getByTestId(`profile-card-${profileId}`).click();
  const loginInput = page.getByTestId("login-input");
  const passwordInput = page.getByTestId("password-input");
  const loginSubmit = page.getByTestId("login-submit").getByRole("button");
  await loginInput.fill(credentials.demoLogin);
  await expect(loginInput).toHaveValue(credentials.demoLogin);
  await passwordInput.fill(credentials.demoPassword);
  await expect(passwordInput).toHaveValue(credentials.demoPassword);
  await expect(loginSubmit).toBeEnabled();
  await loginSubmit.click();
  await page.getByTestId("open-metronome").click();
  await expect(page.getByTestId("go-sources").getByRole("button")).toBeEnabled();
  await page.getByTestId("go-sources").getByRole("button").click();
  await page.getByTestId("connect-multibank").click();
  await page.getByTestId("connect-documents").click();
  await page.getByTestId("connect-industry_ops").click();
  await page.getByTestId("collect-obligations").click();
  await expect(page.getByText("Распознаю, но не додумываю")).toBeVisible();
  await expect(page.getByTestId("go-clarification")).toBeVisible({ timeout: 8_000 });
  await page.getByTestId("go-clarification").getByRole("button").click();
  await page.getByTestId("clarify-2026-08-18").click();
  await page.getByTestId("recalculate-summary").getByRole("button").click();
  await expect(page.locator(".free-amount")).toHaveText(expectedFree);
}

export async function completeP0Flow(page: Page, profileLabel: keyof typeof profileMap) {
  await reachSafeToSpend(page, profileLabel);
  await page.getByTestId("how-calculated-link").click();
  await page.getByTestId("how-calculated-done").getByRole("button").click();
  await page.getByTestId("go-reserve-rule").getByRole("button").click();
  await page.getByTestId("prepare-reserve-rule").getByRole("button").click();
  await page.getByTestId("save-reserve-format").getByRole("button").click();
  await expect(page).toHaveURL(/\/rule-active$/);
  await expect(page.getByRole("heading", { name: "Правило активно" })).toBeVisible();
}
