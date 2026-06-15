import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { requireRole } from "@/src/core/http/auth";

const schema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  content: z.string().min(3).optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const payload = schema.parse(await request.json());
    const { id } = await context.params;
    const doc = await container.documentationRepository.update(id, payload);
    return NextResponse.json(doc);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const { id } = await context.params;
    await container.documentationRepository.softDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleHttpError(error);
  }
}
