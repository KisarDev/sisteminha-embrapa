import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";

export async function GET() {
  try {
    const session = await readSession();
    const user = await container.authService.getProfile(session.sub);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await readSession();
    const payload = await request.json();
    const user = await container.authService.updateProfile(session.sub, payload);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}
