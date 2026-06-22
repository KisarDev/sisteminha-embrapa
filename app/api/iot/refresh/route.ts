import { NextResponse } from "next/server";
import { SensorType, UserRole } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";
import { DEFAULT_SENSOR_TYPES } from "@/src/modules/iot/services/IotIngestionService";

export async function POST() {
  try {
    const session = await readSession();
    const created = await container.simulationIngestionService.ingest(DEFAULT_SENSOR_TYPES, session.sub);
    return NextResponse.json({ count: created.length });
  } catch (error) {
    return handleHttpError(error);
  }
}
