import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/src/core/di/container";
import { REGIOES } from "@/src/modules/calculator/data/crops";
import type { Regiao } from "@/src/modules/calculator/data/crops";
import { handleHttpError } from "@/src/core/http/response";

const schema = z.object({
  cultura: z.string().min(1, "Selecione uma cultura."),
  kgPorSemana: z.number().positive("Quantidade deve ser maior que zero."),
  regiao: z.string().refine(
    (val) => (REGIOES as readonly string[]).includes(val),
    "Região inválida."
  ),
});

export async function POST(request: NextRequest) {
  try {
    const { cultura, kgPorSemana, regiao } = schema.parse(await request.json());
    const result = container.productionScalingService.calculate({ cultura, kgPorSemana, regiao: regiao as Regiao });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    return handleHttpError(error);
  }
}
