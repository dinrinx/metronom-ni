import { z } from "zod";

export const gigachatRequestSchema = z.object({
  mode: z.enum(["mock", "live", "auto"]).default("auto"),
  kind: z.enum(["explainDecision"]),
  payload: z.object({
    industryProfileId: z.enum(["horeca", "beauty", "retail"]),
    safeToSpend: z.number().int().nonnegative(),
    committedTotal: z.number().int().nonnegative(),
    currentAccountsTotal: z.number().int().nonnegative(),
    clarificationDate: z.string(),
  }),
});

export const explanationResponseSchema = z.object({
  explanation: z.string().min(20),
});

export type GigachatRequest = z.infer<typeof gigachatRequestSchema>;
