import { NextRequest, NextResponse } from "next/server";
import { SensorType } from "@prisma/client";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";

const querySchema = z.object({
  sensorType: z.nativeEnum(SensorType),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await readSession();
    const parsed = querySchema.parse({
      sensorType: request.nextUrl.searchParams.get("sensorType"),
      startDate: request.nextUrl.searchParams.get("startDate") ?? undefined,
      endDate: request.nextUrl.searchParams.get("endDate") ?? undefined,
    });

    const stats = await container.dashboardService.getStats(
      parsed.sensorType,
      session.sub,
      parsed.startDate ? new Date(parsed.startDate) : undefined,
      parsed.endDate ? new Date(parsed.endDate) : undefined,
    );

    return NextResponse.json(stats);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Parâmetros inválidos." }, { status: 400 });
    }

    return handleHttpError(error);
  }
}