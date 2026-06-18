import { NextRequest, NextResponse } from "next/server";
import { SensorType } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";

export async function GET(request: NextRequest) {
  try {
    await readSession(); // Require authentication

    const searchParams = request.nextUrl.searchParams;
    const sensorType = searchParams.get("sensorType") as SensorType | null;

    const alerts = await container.alertService.getActiveAlerts(sensorType || undefined);

    return NextResponse.json({
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    return handleHttpError(error);
  }
}
