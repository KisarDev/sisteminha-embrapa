import { NextRequest, NextResponse } from "next/server";
import { SensorType } from "@prisma/client";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { HistoricalPeriod } from "@/src/modules/dashboard/services/DashboardService";

const querySchema = z.object({
  sensorType: z.nativeEnum(SensorType),
  period: z.enum(["24h", "7d", "30d"]).default("24h"),
});

export async function GET(request: NextRequest) {
  try {
    const parsed = querySchema.parse({
      sensorType: request.nextUrl.searchParams.get("sensorType"),
      period: request.nextUrl.searchParams.get("period") ?? "24h",
    });

    const readings = await container.dashboardService.getHistoricalData(
      parsed.sensorType,
      parsed.period as HistoricalPeriod,
    );

    return NextResponse.json(readings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Parâmetros inválidos." }, { status: 400 });
    }

    return handleHttpError(error);
  }
}