import { NextResponse } from "next/server";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";

export async function GET() {
  try {
    const summary = await container.dashboardService.getSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return handleHttpError(error);
  }
}