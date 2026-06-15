import { NextRequest, NextResponse } from "next/server";
import { LessonCategory, UserRole } from "@prisma/client";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { requireRole } from "@/src/core/http/auth";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  videoUrl: z.string().url(),
  category: z.nativeEnum(LessonCategory),
  thumbnailUrl: z.string().url().optional(),
  content: z.string().min(3),
});

export async function GET() {
  const lessons = await container.lessonRepository.findMany();
  return NextResponse.json(lessons);
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const payload = schema.parse(await request.json());
    const lesson = await container.lessonRepository.create(payload);
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}
