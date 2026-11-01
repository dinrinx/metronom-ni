"use client";

import { FormEvent, useState } from "react";

type SuccessResult = {
  ok: true;
  answer: string;
  diagnostics: {
    runtime: string;
    region: string;
    model: string;
    oauthMs: number;
    generationMs: number;
    totalMs: number;
  };
};

type ErrorResult = {
  ok: false;
  error: {
    phase: "configuration" | "oauth" | "generation" | "network";
    code: string;
    message: string;
    hint: string;
    status?: number;
  };
  diagnostics: {
    runtime: string;
    region: string;
    totalMs: number;
  };
};

type TestResult = SuccessResult | ErrorResult;

const phaseLabels: Record<ErrorResult["error"]["phase"], string> = {
  configuration: "Переменные окружения",
  oauth: "OAuth GigaChat",
  generation: "Запрос к модели",
  network: "Сеть / TLS",
};

export default function Home() {
  const [prompt, setPrompt] = useState(
    "Ответь строго одной короткой строкой: Метроном подключён и готов работать.",
  );
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function runTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/gigachat-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      setResult((await response.json()) as TestResult);
    } catch {
      setResult({
        ok: false,
        error: {
          phase: "network",
          code: "BROWSER_REQUEST_FAILED",
          message: "Браузер не смог обратиться к серверному route приложения.",
          hint: "Открой Vercel Functions Logs и проверь, запущен ли deployment.",
        },
        diagnostics: { runtime: "unknown", region: "unknown", totalMs: 0 },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="card">
        <div className="eyebrow">МЕТРОНОМ · ТЕХНИЧЕСКИЙ ТЕСТ</div>
        <h1>GigaChat × Vercel</h1>
        <p className="lead">
          Один запрос проверяет серверный route, OAuth, TLS-сертификат и генерацию. Ключ
          остаётся на сервере.
        </p>

        <form onSubmit={runTest}>
          <label htmlFor="prompt">Тестовая команда</label>
          <textarea
            id="prompt"
            value={prompt}
            maxLength={500}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <button type="submit" disabled={loading || prompt.trim().length === 0}>
            {loading ? "Проверяем соединение…" : "Запустить тест →"}
          </button>
        </form>

        {!result && (
          <div className="checklist" aria-label="Что проверяет тест">
            <span>01 · Vercel Function</span>
            <span>02 · OAuth</span>
            <span>03 · TLS</span>
            <span>04 · GigaChat</span>
          </div>
        )}

        {result?.ok && (
          <div className="result success" role="status">
            <div className="result-title"><i /> Соединение работает</div>
            <blockquote>{result.answer}</blockquote>
            <dl>
              <div><dt>Модель</dt><dd>{result.diagnostics.model}</dd></div>
              <div><dt>Регион</dt><dd>{result.diagnostics.region}</dd></div>
              <div><dt>OAuth</dt><dd>{result.diagnostics.oauthMs} мс</dd></div>
              <div><dt>Генерация</dt><dd>{result.diagnostics.generationMs} мс</dd></div>
              <div><dt>Всего</dt><dd>{result.diagnostics.totalMs} мс</dd></div>
            </dl>
          </div>
        )}

        {result && !result.ok && (
          <div className="result failure" role="alert">
            <div className="result-title"><i /> Тест остановился</div>
            <div className="failure-phase">Этап: {phaseLabels[result.error.phase]}</div>
            <h2>{result.error.code}</h2>
            <p>{result.error.message}</p>
            <div className="hint">Что делать: {result.error.hint}</div>
            <small>
              Runtime: {result.diagnostics.runtime} · Region: {result.diagnostics.region} · {result.diagnostics.totalMs} мс
            </small>
          </div>
        )}
      </section>
    </main>
  );
}
