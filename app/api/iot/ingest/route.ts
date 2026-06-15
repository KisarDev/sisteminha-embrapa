import { NextRequest, NextResponse } from "next/server";
import { SensorType, UserRole } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { requireRole } from "@/src/core/http/auth";
import { DEFAULT_SENSOR_TYPES } from "@/src/modules/iot/services/IotIngestionService";

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const payload = (await request.json().catch(() => ({}))) as {
      source?: "real" | "simulation";
      sensorTypes?: SensorType[];
    };

    const service = payload.source === "real" ? container.realIngestionService : container.simulationIngestionService;
    const created = await service.ingest(payload.sensorTypes ?? DEFAULT_SENSOR_TYPES);
    return NextResponse.json({ count: created.length, data: created });
  } catch (error) {
    return handleHttpError(error);
  }
}
