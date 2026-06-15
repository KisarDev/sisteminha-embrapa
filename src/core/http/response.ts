import { NextResponse } from "next/server";
import { AppError } from "@/src/core/errors/AppError";

export function handleHttpError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode });
  }

  console.error(error);
  return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
}
