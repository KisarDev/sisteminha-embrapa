import { AppError } from "@/src/core/errors/AppError";
import { CULTURAS, REGIOES } from "@/src/modules/calculator/data/crops";
import type { Regiao, Cultura } from "@/src/modules/calculator/data/crops";
import {
  ICropCalculator,
  ProductionScalingInput,
  ProductionScalingResult,
} from "@/src/modules/calculator/interfaces/ICropCalculator";

function mediana(valores: [number, number]): number {
  return (valores[0] + valores[1]) / 2;
}

function lookupCultura(nome: string): Cultura {
  const cultura = CULTURAS.find(
    (c) => c.nome.toLowerCase() === nome.trim().toLowerCase()
  );
  if (!cultura) {
    throw new AppError(400, `Cultura "${nome}" não encontrada.`);
  }
  return cultura;
}

export class ProductionScalingService implements ICropCalculator {
  calculate(input: ProductionScalingInput): ProductionScalingResult {
    if (input.kgPorSemana <= 0) {
      throw new AppError(400, "Quantidade deve ser maior que zero.");
    }

    const regiao = input.regiao as Regiao;
    if (!REGIOES.includes(regiao)) {
      throw new AppError(400, `Região "${input.regiao}" inválida.`);
    }

    const cultura = lookupCultura(input.cultura);
    const epocaRecomendada = cultura.epocas_plantio[regiao];

    const cicloMedio = mediana(cultura.dias_colheita);
    const intervaloDias = 7;
    const semanasSimultaneas = Math.ceil(cicloMedio / intervaloDias);

    let areaPorSemanaM2: number;
    let plantasPorSemana: number;

    if (cultura.tipo_plantio === 'm2') {
      const prodMedia = mediana(cultura.producao_por_m2!);
      areaPorSemanaM2 = Number((input.kgPorSemana / prodMedia).toFixed(2));
      const areaPorPlantaM2 = (cultura.espacamento_linha_cm * cultura.espacamento_planta_cm) / 10000;
      plantasPorSemana = Math.ceil(areaPorSemanaM2 / areaPorPlantaM2);
      areaPorSemanaM2 = Number((plantasPorSemana * areaPorPlantaM2).toFixed(2));
    } else {
      const prodMedia = mediana(cultura.producao_por_planta!);
      plantasPorSemana = Math.ceil(input.kgPorSemana / prodMedia);
      const areaPorPlantaM2 = (cultura.espacamento_linha_cm * cultura.espacamento_planta_cm) / 10000;
      areaPorSemanaM2 = Number((plantasPorSemana * areaPorPlantaM2).toFixed(2));
    }

    const areaTotalM2 = Number((areaPorSemanaM2 * semanasSimultaneas).toFixed(2));
    const plantasTotal = plantasPorSemana * semanasSimultaneas;

    const tipoArea = cultura.tipo_plantio === 'm2' ? 'm²' : 'plantas';
    const valorSemana = cultura.tipo_plantio === 'm2' ? `${areaPorSemanaM2} m²` : `${plantasPorSemana} plantas`;

    const instrucaoPlantio = cultura.epocas_plantio[regiao].toLowerCase().includes('não recomendado')
      ? `Atenção: esta cultura não é recomendada para a região ${regiao}. Consulte um técnico agrícola.`
      : `Plante ${valorSemana} (${tipoArea}) a cada ${intervaloDias} dias para colher ${input.kgPorSemana} kg por semana de forma contínua. ` +
        `Mantenha ${semanasSimultaneas} plantios simultâneos (total de ${cultura.tipo_plantio === 'm2' ? areaTotalM2 + ' m²' : plantasTotal + ' plantas'}).`;

    return {
      cultura: cultura.nome,
      regiao: regiao,
      producaoPorM2: cultura.producao_por_m2,
      producaoPorPlanta: cultura.producao_por_planta,
      producaoDisplay: cultura.producao_display,
      espacamentoLinhaCm: cultura.espacamento_linha_cm,
      espacamentoPlantaCm: cultura.espacamento_planta_cm,
      diasColheita: cultura.dias_colheita,
      epocaRecomendada: epocaRecomendada,
      tipoPlantio: cultura.tipo_plantio,
      areaPorSemanaM2: areaPorSemanaM2,
      plantasPorSemana: plantasPorSemana,
      intervaloDias: intervaloDias,
      semanasSimultaneas: semanasSimultaneas,
      areaTotalM2: areaTotalM2,
      plantasTotal: plantasTotal,
      instrucaoPlantio: instrucaoPlantio,
    };
  }
}
