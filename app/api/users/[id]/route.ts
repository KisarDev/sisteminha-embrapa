import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { requireRole } from "@/src/core/http/auth";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const { id } = await context.params;
    await container.authService.softDeleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleHttpError(error);
  }
}
