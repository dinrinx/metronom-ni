import { NextResponse } from "next/server";
import { resolveExplanation } from "@/lib/gigachat/provider";
import { gigachatRequestSchema } from "@/lib/gigachat/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = gigachatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Запрос к LLM провайдеру не прошёл валидацию.",
          },
        },
        { status: 400 },
      );
    }

    const resolved = await resolveExplanation(parsed.data);
    return NextResponse.json({
      ok: true,
      explanation: resolved.explanation,
      source: resolved.source,
      errorCode: "errorCode" in resolved ? resolved.errorCode : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "PROVIDER_UNAVAILABLE",
          message: error instanceof Error ? error.message : "Провайдер временно недоступен.",
        },
      },
      { status: 500 },
    );
  }
}
