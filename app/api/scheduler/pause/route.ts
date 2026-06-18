import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { requireRole } from "@/src/core/http/auth";
import { handleHttpError } from "@/src/core/http/response";

export async function POST() {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    container.schedulerService.pause();

    return NextResponse.json({
      message: "Scheduler pausado com sucesso.",
      status: container.schedulerService.getStatus(),
    });
  } catch (error) {
    return handleHttpError(error);
  }
}