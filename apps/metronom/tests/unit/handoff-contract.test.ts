import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

test("CampaignClosed contract copies stay identical across both apps", () => {
  const metronomContract = readFileSync(resolve(process.cwd(), "lib/handoff/campaign-closed.ts"), "utf8");
  const narodnyeInvesticiiContract = readFileSync(
    resolve(process.cwd(), "../narodnye-investicii/src/lib/handoff/campaign-closed.ts"),
    "utf8",
  );

  expect(narodnyeInvesticiiContract).toBe(metronomContract);
});
