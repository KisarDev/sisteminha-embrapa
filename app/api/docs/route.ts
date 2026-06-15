import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { requireRole } from "@/src/core/http/auth";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  content: z.string().min(3),
});

export async function GET() {
  const docs = await container.documentationRepository.findMany();
  return NextResponse.json(docs);
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const payload = schema.parse(await request.json());
    const doc = await container.documentationRepository.create(payload);
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}
