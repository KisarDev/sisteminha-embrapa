import type { Regiao } from "@/src/modules/calculator/data/crops";

export type ProductionScalingInput = {
  cultura: string;
  kgPorSemana: number;
  regiao: Regiao;
};

export type ProductionScalingResult = {
  cultura: string;
  regiao: Regiao;
  producaoPorM2: [number, number] | null;
  producaoPorPlanta: [number, number] | null;
  producaoDisplay: string;
  espacamentoLinhaCm: number;
  espacamentoPlantaCm: number;
  diasColheita: [number, number];
  epocaRecomendada: string;
  tipoPlantio: 'm2' | 'planta';
  areaPorSemanaM2: number;
  plantasPorSemana: number;
  intervaloDias: number;
  semanasSimultaneas: number;
  areaTotalM2: number;
  plantasTotal: number;
  instrucaoPlantio: string;
};

export interface ICropCalculator {
  calculate(input: ProductionScalingInput): ProductionScalingResult;
}
