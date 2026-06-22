import { NextResponse } from "next/server";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { readSession } from "@/src/core/http/auth";

export async function GET() {
  try {
    const session = await readSession();
    const summary = await container.dashboardService.getSummary(session.sub);
    return NextResponse.json(summary);
  } catch (error) {
    return handleHttpError(error);
  }
}