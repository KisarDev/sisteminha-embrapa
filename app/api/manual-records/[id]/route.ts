import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";

const updateSchema = z.object({
  quantity: z.number().optional(),
  notes: z.string().optional(),
  observedAt: z.coerce.date().optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await readSession();
    const payload = updateSchema.parse(await request.json());
    const { id } = await context.params;
    const updated = await container.manualRecordRepository.update(id, session.sub, payload);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await readSession();
    const { id } = await context.params;
    await container.manualRecordRepository.softDelete(id, session.sub);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleHttpError(error);
  }
}
