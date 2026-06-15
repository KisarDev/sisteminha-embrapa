import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { handleHttpError } from "@/src/core/http/response";

const schema = z.object({
  crop: z.string().min(2),
  desiredProduction: z.number().positive(),
  desiredQuantity: z.number().positive(),
  periodInDays: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = schema.parse(await request.json());
    const result = container.productionScalingService.calculate(payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}
