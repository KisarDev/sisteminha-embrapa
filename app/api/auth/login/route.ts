import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { setSessionCookie } from "@/src/core/http/auth";
import { handleHttpError } from "@/src/core/http/response";
import { checkRateLimit } from "@/src/core/http/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "127.0.0.1";
    const { allowed, retryAfter } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    const payload = await request.json();
    const result = await container.authService.login(payload);
    await setSessionCookie(result.token);

    return NextResponse.json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}
