import { NextRequest, NextResponse } from "next/server";
import { SensorType } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await readSession();
    const sensorType = request.nextUrl.searchParams.get("sensorType") as SensorType | null;

    if (!sensorType) {
      return NextResponse.json({ message: "sensorType é obrigatório." }, { status: 400 });
    }

    const source = request.nextUrl.searchParams.get("source") ?? "simulation";
    const service = source === "real" ? container.realIngestionService : container.simulationIngestionService;
    const [created] = await service.ingest([sensorType], session.sub);

    return NextResponse.json(created);
  } catch (error) {
    return handleHttpError(error);
  }
}
