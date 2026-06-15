import { NextRequest, NextResponse } from "next/server";
import { ManualRecordType } from "@prisma/client";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";

const schema = z.object({
  type: z.nativeEnum(ManualRecordType),
  quantity: z.number().optional(),
  notes: z.string().optional(),
  observedAt: z.coerce.date(),
});

export async function GET() {
  try {
    const session = await readSession();
    const records = await container.manualRecordRepository.findByUser(session.sub);
    return NextResponse.json(records);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await readSession();
    const payload = schema.parse(await request.json());
    const record = await container.manualRecordRepository.create({
      ...payload,
      userId: session.sub,
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}
