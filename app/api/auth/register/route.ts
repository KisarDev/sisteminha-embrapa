import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { setSessionCookie } from "@/src/core/http/auth";
import { handleHttpError } from "@/src/core/http/response";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const result = await container.authService.register(payload);
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
