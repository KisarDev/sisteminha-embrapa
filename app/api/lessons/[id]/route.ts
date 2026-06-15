import { NextRequest, NextResponse } from "next/server";
import { LessonCategory, UserRole } from "@prisma/client";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { requireRole } from "@/src/core/http/auth";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  videoUrl: z.string().url().optional(),
  category: z.nativeEnum(LessonCategory).optional(),
  thumbnailUrl: z.string().url().optional(),
  content: z.string().min(3).optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const payload = updateSchema.parse(await request.json());
    const { id } = await context.params;
    const lesson = await container.lessonRepository.update(id, payload);
    return NextResponse.json(lesson);
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
    await container.lessonRepository.softDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleHttpError(error);
  }
}
