import { rootCertificates } from "node:tls";
import { Agent, fetch as secureFetch } from "undici";
import { RUSSIAN_TRUSTED_ROOT_CA, RUSSIAN_TRUSTED_SUB_CA } from "@m/lib/gigachat/russian-trusted-ca";
import { explanationResponseSchema } from "@m/lib/gigachat/schemas";

const OAUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const CHAT_URL = "https://api.giga.chat/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 8_000;
const TOKEN_SAFETY_MARGIN_MS = 60_000;

const dispatcher = new Agent({
  connect: {
    ca: [...rootCertificates, RUSSIAN_TRUSTED_ROOT_CA, RUSSIAN_TRUSTED_SUB_CA],
    rejectUnauthorized: true,
  },
});

type TokenCache = {
  accessToken: string;
  expiresAt: number;
} | null;

let tokenCache: TokenCache = null;

export class GigachatError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

function normalizeAuthorizationKey(value: string): string {
  const trimmed = value.trim();
  return /^basic\s/i.test(trimmed) ? trimmed : `Basic ${trimmed}`;
}

async function parseJsonSafe(response: { text(): Promise<string> }): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text.slice(0, 500) };
  }
}

async function fetchWithTimeout(url: string, init: Parameters<typeof secureFetch>[1]) {
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return secureFetch(url, {
    ...init,
    dispatcher,
    signal,
  });
}

async function getAccessToken() {
  if (tokenCache !== null && Date.now() < tokenCache.expiresAt - TOKEN_SAFETY_MARGIN_MS) {
    return tokenCache.accessToken;
  }

  const authKey = process.env.GIGACHAT_AUTH_KEY;
  if (!authKey) {
    throw new GigachatError("MISSING_GIGACHAT_AUTH_KEY", "На сервере не задан GIGACHAT_AUTH_KEY.");
  }

  const scope = process.env.GIGACHAT_SCOPE ?? "GIGACHAT_API_PERS";

  const response = await fetchWithTimeout(OAUTH_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: normalizeAuthorizationKey(authKey),
      RqUID: crypto.randomUUID(),
      "User-Agent": "metronome/0.1",
    },
    body: new URLSearchParams({ scope }),
  });

  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    throw new GigachatError("OAUTH_REJECTED", JSON.stringify(payload).slice(0, 500), response.status);
  }

  const record = payload as { access_token?: unknown; expires_at?: unknown };
  if (typeof record.access_token !== "string") {
    throw new GigachatError("TOKEN_MISSING", "OAuth ответил без access_token.", 502);
  }

  const expiresAt = typeof record.expires_at === "number" ? record.expires_at : Date.now() + 30 * 60 * 1000;
  tokenCache = {
    accessToken: record.access_token,
    expiresAt,
  };

  return record.access_token;
}

export async function explainDecisionWithGigachat(input: {
  industryLabel: string;
  safeToSpend: number;
  committedTotal: number;
  currentAccountsTotal: number;
  clarificationDate: string;
}) {
  const accessToken = await getAccessToken();
  const model = process.env.GIGACHAT_MODEL ?? "GigaChat-3-Ultra";

  async function requestExplanation(prompt: string) {
    const response = await fetchWithTimeout(CHAT_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "metronome/0.1",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "Ты объясняешь уже рассчитанное финансовое решение. Ответь JSON-объектом вида {\"explanation\":\"...\"} и не добавляй никакого другого текста.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const payload = (await parseJsonSafe(response)) as {
      choices?: Array<{ message?: { content?: unknown } }>;
      message?: string;
    };

    if (!response.ok) {
      throw new GigachatError("GENERATION_REJECTED", payload.message ?? "Generation failed.", response.status);
    }

    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw new GigachatError("EMPTY_COMPLETION", "Модель вернула ответ без content.", 502);
    }

    return content;
  }

  const prompt =
    `Профиль: ${input.industryLabel}. ` +
    `На счетах ${input.currentAccountsTotal} рублей, связано обязательствами ${input.committedTotal}, реально свободно ${input.safeToSpend}. ` +
    `Дата поставщика подтверждена пользователем: ${input.clarificationDate}. ` +
    "Коротко объясни, почему логический резерв безопаснее физического перевода на этом шаге.";

  const raw = await requestExplanation(prompt);
  const parsed = explanationResponseSchema.safeParse(JSON.parse(raw));
  if (parsed.success) {
    return parsed.data.explanation;
  }

  const repairRaw = await requestExplanation(
    `${prompt} Верни строго валидный JSON по схеме {"explanation":"строка не короче 20 символов"}.`,
  );
  const repaired = explanationResponseSchema.safeParse(JSON.parse(repairRaw));
  if (!repaired.success) {
    throw new GigachatError("INVALID_STRUCTURED_OUTPUT", "Ответ модели не прошёл схему.", 502);
  }

  return repaired.data.explanation;
}
