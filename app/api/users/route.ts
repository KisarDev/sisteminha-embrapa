import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { requireRole } from "@/src/core/http/auth";

export async function GET() {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const users = await container.authService.listUsers();
    return NextResponse.json(users);
  } catch (error) {
    return handleHttpError(error);
  }
}
