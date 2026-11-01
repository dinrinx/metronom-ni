import { NextResponse } from "next/server";
import { rootCertificates } from "node:tls";
import { Agent, fetch as secureFetch } from "undici";
import {
  RUSSIAN_TRUSTED_ROOT_CA,
  RUSSIAN_TRUSTED_SUB_CA,
} from "../../../lib/russian-trusted-ca";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const OAUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const CHAT_URL = "https://api.giga.chat/v1/chat/completions";

// A dedicated dispatcher trusts the Russian CA only for the two GigaChat
// requests below. The rest of the app keeps Node.js's normal TLS policy.
const gigachatDispatcher = new Agent({
  connect: {
    ca: [
      ...rootCertificates,
      RUSSIAN_TRUSTED_ROOT_CA,
      RUSSIAN_TRUSTED_SUB_CA,
    ],
    rejectUnauthorized: true,
  },
});

type Phase = "configuration" | "oauth" | "generation" | "network";

class DiagnosticError extends Error {
  constructor(
    readonly phase: Phase,
    readonly code: string,
    message: string,
    readonly hint: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

function deploymentInfo(startedAt: number) {
  return {
    runtime: `node ${process.version}`,
    region: process.env.VERCEL_REGION ?? "local",
    totalMs: Date.now() - startedAt,
  };
}

function normalizeAuthorizationKey(value: string) {
  const trimmed = value.trim();
  return /^basic\s/i.test(trimmed) ? trimmed : `Basic ${trimmed}`;
}

function safeProviderMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return "Провайдер не вернул описание.";
  const record = payload as Record<string, unknown>;
  const message = record.message ?? record.error_description ?? record.error;
  return typeof message === "string" ? message.slice(0, 500) : "Провайдер не вернул описание.";
}

async function parseResponse(response: { text(): Promise<string> }) {
  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text.slice(0, 500) };
  }
}

function classifyNetworkError(error: unknown) {
  const cause = error instanceof Error && "cause" in error
    ? (error.cause as { code?: string; message?: string } | undefined)
    : undefined;
  const code = cause?.code ?? "NETWORK_REQUEST_FAILED";
  const certificateCodes = new Set([
    "SELF_SIGNED_CERT_IN_CHAIN",
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
    "CERT_HAS_EXPIRED",
  ]);

  if (certificateCodes.has(code)) {
    return new DiagnosticError(
      "network",
      "TLS_CERTIFICATE_ERROR",
      `Node.js не доверяет цепочке сертификатов GigaChat (${code}).`,
      "Deployment жив, но Vercel runtime не принял сертификат. Следующий шаг — подключить сертификат Минцифры через NODE_EXTRA_CA_CERTS или вынести этот server route в российское облако.",
    );
  }

  return new DiagnosticError(
    "network",
    code,
    cause?.message ?? (error instanceof Error ? error.message : "Неизвестная сетевая ошибка."),
    "Повтори тест и открой Functions Logs в Vercel. Если ошибка стабильна, проверь DNS, доступность endpoint и ограничения региона.",
  );
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const authKey = process.env.GIGACHAT_AUTH_KEY;
    const scope = process.env.GIGACHAT_SCOPE ?? "GIGACHAT_API_PERS";
    const model = process.env.GIGACHAT_MODEL ?? "GigaChat-3-Ultra";

    if (!authKey) {
      throw new DiagnosticError(
        "configuration",
        "MISSING_GIGACHAT_AUTH_KEY",
        "На сервере не задан GIGACHAT_AUTH_KEY.",
        "Добавь ключ в Vercel → Project Settings → Environment Variables и сделай Redeploy.",
        500,
      );
    }

    const body = (await request.json().catch(() => ({}))) as { prompt?: unknown };
    const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, 500) : "";
    if (!prompt) {
      throw new DiagnosticError(
        "configuration",
        "EMPTY_PROMPT",
        "Тестовая команда пустая.",
        "Введи короткую команду и повтори тест.",
        400,
      );
    }

    const oauthStartedAt = Date.now();
    let oauthResponse;
    try {
      oauthResponse = await secureFetch(OAUTH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          RqUID: crypto.randomUUID(),
          Authorization: normalizeAuthorizationKey(authKey),
          "User-Agent": "metronome-vercel-smoke-test/0.1",
        },
        body: new URLSearchParams({ scope }),
        dispatcher: gigachatDispatcher,
      });
    } catch (error) {
      throw classifyNetworkError(error);
    }

    const oauthPayload = await parseResponse(oauthResponse);
    if (!oauthResponse.ok) {
      throw new DiagnosticError(
        "oauth",
        "OAUTH_REJECTED",
        safeProviderMessage(oauthPayload),
        oauthResponse.status === 401 || oauthResponse.status === 403
          ? "Проверь Authorization key и scope. Для аккаунта физлица нужен GIGACHAT_API_PERS. После изменения переменных сделай Redeploy."
          : "Проверь ответ в Functions Logs и повтори запрос через минуту.",
        oauthResponse.status,
      );
    }

    const accessToken = (oauthPayload as { access_token?: unknown }).access_token;
    if (typeof accessToken !== "string") {
      throw new DiagnosticError(
        "oauth",
        "TOKEN_MISSING_IN_RESPONSE",
        "OAuth ответил успешно, но access_token отсутствует.",
        "Проверь тип ключа и scope в кабинете GigaChat.",
        502,
      );
    }
    const oauthMs = Date.now() - oauthStartedAt;

    const generationStartedAt = Date.now();
    let generationResponse;
    try {
      generationResponse = await secureFetch(CHAT_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "metronome-vercel-smoke-test/0.1",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "Ты выполняешь техническую проверку соединения. Отвечай кратко и не добавляй пояснений.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          max_tokens: 120,
        }),
        dispatcher: gigachatDispatcher,
      });
    } catch (error) {
      throw classifyNetworkError(error);
    }

    const generationPayload = await parseResponse(generationResponse);
    if (!generationResponse.ok) {
      throw new DiagnosticError(
        "generation",
        "GENERATION_REJECTED",
        safeProviderMessage(generationPayload),
        generationResponse.status === 403
          ? "Проверь доступ ключа к выбранной модели. Попробуй GIGACHAT_MODEL=GigaChat-2-Max и сделай Redeploy."
          : "Проверь имя модели и повтори запрос. Полный серверный статус виден в Vercel Functions Logs.",
        generationResponse.status,
      );
    }

    const answer = (generationPayload as {
      choices?: Array<{ message?: { content?: unknown } }>;
    }).choices?.[0]?.message?.content;

    if (typeof answer !== "string") {
      throw new DiagnosticError(
        "generation",
        "ANSWER_MISSING_IN_RESPONSE",
        "Модель ответила без текстового content.",
        "Повтори тест. Если ошибка сохраняется, временно выбери GigaChat-2-Max.",
        502,
      );
    }

    return NextResponse.json({
      ok: true,
      answer,
      diagnostics: {
        ...deploymentInfo(startedAt),
        model,
        oauthMs,
        generationMs: Date.now() - generationStartedAt,
      },
    });
  } catch (error) {
    const diagnostic = error instanceof DiagnosticError
      ? error
      : new DiagnosticError(
          "network",
          "UNEXPECTED_SERVER_ERROR",
          error instanceof Error ? error.message : "Неизвестная ошибка.",
          "Открой Vercel Functions Logs и проверь stack trace.",
          500,
        );

    return NextResponse.json(
      {
        ok: false,
        error: {
          phase: diagnostic.phase,
          code: diagnostic.code,
          message: diagnostic.message,
          hint: diagnostic.hint,
          status: diagnostic.status,
        },
        diagnostics: deploymentInfo(startedAt),
      },
      { status: diagnostic.status && diagnostic.status < 500 ? diagnostic.status : 502 },
    );
  }
}
