import { NextRequest, NextResponse } from "next/server";
import { SensorType, UserRole } from "@prisma/client";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { requireRole } from "@/src/core/http/auth";
import { handleHttpError } from "@/src/core/http/response";

const triggerSchema = z.object({
  source: z.enum(["real", "simulation"]).optional(),
  sensorTypes: z.array(z.nativeEnum(SensorType)).optional(),
});

export async function GET() {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    return NextResponse.json(container.schedulerService.getStatus());
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const payload = triggerSchema.parse((await request.json().catch(() => ({}))) as unknown);
    const readings = await container.schedulerService.triggerManual(payload.source, payload.sensorTypes);

    return NextResponse.json({
      message: "Leitura manual executada com sucesso.",
      count: readings.length,
      data: readings,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }

    return handleHttpError(error);
  }
}