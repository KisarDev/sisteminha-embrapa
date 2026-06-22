import { NextRequest, NextResponse } from "next/server";
import { SensorType } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await readSession();
    const sensorType = request.nextUrl.searchParams.get("sensorType") as SensorType | null;
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "50", 10);
    const offset = parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10);
    const startDate = request.nextUrl.searchParams.get("startDate") ?? undefined;
    const endDate = request.nextUrl.searchParams.get("endDate") ?? undefined;

    const readings = await container.sensorReadingRepository.findAll(session.sub, {
      sensorType: sensorType ?? undefined,
      limit: Math.min(Math.max(limit, 1), 500),
      offset: Math.max(offset, 0),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return NextResponse.json(readings);
  } catch (error) {
    return handleHttpError(error);
  }
}
