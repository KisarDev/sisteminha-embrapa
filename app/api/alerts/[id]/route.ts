import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";
import { requireRole } from "@/src/core/http/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole([UserRole.SUPER_ADMIN]);
    const { id } = await params;

    const alert = await container.alertService.resolveAlert(id);

    return NextResponse.json({
      message: "Alerta resolvido com sucesso.",
      data: alert,
    });
  } catch (error) {
    return handleHttpError(error);
  }
}
