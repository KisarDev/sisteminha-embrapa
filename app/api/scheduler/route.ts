import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { requireRole } from "@/src/core/http/auth";
import { handleHttpError } from "@/src/core/http/response";

export async function GET() {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    return NextResponse.json(container.schedulerService.getStatus());
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function POST() {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    await container.schedulerService.runForAllUsers();

    return NextResponse.json({
      message: "Leitura manual executada com sucesso.",
    });
  } catch (error) {
    return handleHttpError(error);
  }
}