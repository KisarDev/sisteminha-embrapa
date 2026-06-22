"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Select } from "@/src/components/ui/Select";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Badge } from "@/src/components/ui/Badge";
import { CULTURAS, REGIOES } from "@/src/modules/calculator/data/crops";
import type { Regiao } from "@/src/modules/calculator/data/crops";
import { api } from "@/src/lib/api";

type Resultado = {
  cultura: string;
  regiao: string;
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

export default function CalculatorPage() {
  const [query, setQuery] = useState("");
  const [cultura, setCultura] = useState("");
  const [aberto, setAberto] = useState(false);
  const [kgPorSemana, setKgPorSemana] = useState("");
  const [regiao, setRegiao] = useState<Regiao>("Sudeste");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtradas = CULTURAS.filter((c) =>
    c.nome.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selecionar(nome: string) {
    setCultura(nome);
    setQuery(nome);
    setAberto(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!cultura) { setError("Selecione uma cultura."); return; }
    setError("");
    setResultado(null);
    setLoading(true);
    try {
      setResultado(await api<Resultado>("/api/calculator/production-scaling", {
        method: "POST",
        body: JSON.stringify({
          cultura,
          kgPorSemana: parseFloat(kgPorSemana),
          regiao,
        }),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao calcular.");
    }
    setLoading(false);
  }

  const culturaSelecionada = CULTURAS.find((c) => c.nome === cultura);
  const epocaRecomendada = culturaSelecionada?.epocas_plantio[regiao];
  const naoRecomendado = epocaRecomendada?.toLowerCase().includes('inadequado') || epocaRecomendada?.toLowerCase().includes('não recomendado');

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Calculadora de Escalonamento" description="Calcule área e plantas necessárias para produzir de forma contínua." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Parâmetros</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <AlertBanner variant="error">{error}</AlertBanner>}

              <div className="flex flex-col gap-1.5" ref={wrapperRef}>
                <label htmlFor="cultura" className="text-sm font-medium text-[var(--color-text)]">
                  Cultura
                </label>
                <div className="relative">
                  <input
                    id="cultura"
                    type="text"
                    role="combobox"
                    aria-expanded={aberto}
                    aria-controls="cultura-list"
                    aria-autocomplete="list"
                    className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                    placeholder="Digite para buscar…"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setCultura(""); setAberto(true); }}
                    onFocus={() => setAberto(true)}
                    autoComplete="off"
                  />
                  {aberto && filtradas.length > 0 && (
                    <ul id="cultura-list" className="absolute z-10 mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-md)] max-h-48 overflow-y-auto">
                      {filtradas.map((c) => (
                        <li key={c.nome}>
                          <button
                            type="button"
                            className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-[var(--color-primary)]/5 ${
                              cultura === c.nome ? "bg-[var(--color-primary)]/10 font-medium text-[var(--color-primary)]" : "text-[var(--color-text)]"
                            }`}
                            onClick={() => selecionar(c.nome)}
                          >
                            {c.nome}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {epocaRecomendada && (
                  <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                    {culturaSelecionada!.producao_display}
                    {' · '}Ciclo: {culturaSelecionada!.dias_colheita[0]}–{culturaSelecionada!.dias_colheita[1]} dias
                    {' · '}{culturaSelecionada!.tipo_plantio_desc}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="kgPorSemana" className="text-sm font-medium text-[var(--color-text)]">
                  Quantidade desejada (kg/semana)
                </label>
                <Input
                  id="kgPorSemana"
                  type="number"
                  step="any"
                  min="0.1"
                  placeholder="Ex: 50"
                  value={kgPorSemana}
                  onChange={(e) => setKgPorSemana(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="regiao" className="text-sm font-medium text-[var(--color-text)]">
                  Região
                </label>
                <Select id="regiao" value={regiao} onChange={(e) => setRegiao(e.target.value as Regiao)}>
                  {REGIOES.map((r) => (<option key={r} value={r}>{r}</option>))}
                </Select>
                {naoRecomendado && (
                  <p className="text-xs text-[var(--color-warning)]">
                    ⚠ Esta cultura não é recomendada para a região {regiao}.
                  </p>
                )}
              </div>

              <Button type="submit" loading={loading}>Calcular</Button>
            </form>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {resultado && (
            <>
              <Card>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{resultado.cultura}</h3>
                  <Badge variant="info">{resultado.regiao}</Badge>
                </div>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                    <dt className="text-[var(--color-text-secondary)]">Produção</dt>
                    <dd className="font-medium text-[var(--color-text)] text-right max-w-[60%]">
                      {resultado.producaoDisplay}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                    <dt className="text-[var(--color-text-secondary)]">Espaçamento</dt>
                    <dd className="font-medium text-[var(--color-text)]">
                      {resultado.espacamentoLinhaCm} cm × {resultado.espacamentoPlantaCm} cm
                      (linha × planta)
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                    <dt className="text-[var(--color-text-secondary)]">Ciclo</dt>
                    <dd className="font-medium text-[var(--color-text)]">
                      {resultado.diasColheita[0]}–{resultado.diasColheita[1]} dias
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                    <dt className="text-[var(--color-text-secondary)]">Época recomendada</dt>
                    <dd className="font-medium text-[var(--color-text)] text-right max-w-[60%]">
                      {resultado.epocaRecomendada}
                    </dd>
                  </div>
                </dl>
              </Card>

              <Card>
                <h4 className="text-base font-semibold text-[var(--color-text)]">
                  Resultado do escalonamento
                </h4>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                    <dt className="text-[var(--color-text-secondary)]">
                      {resultado.tipoPlantio === 'm2' ? 'Área por semana' : 'Plantas por semana'}
                    </dt>
                    <dd className="font-medium text-[var(--color-text)] tabular-nums">
                      {resultado.tipoPlantio === 'm2'
                        ? `${resultado.areaPorSemanaM2} m²`
                        : `${resultado.plantasPorSemana} plantas`
                      }
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                    <dt className="text-[var(--color-text-secondary)]">Intervalo entre plantios</dt>
                    <dd className="font-medium text-[var(--color-text)]">
                      A cada {resultado.intervaloDias} dias
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                    <dt className="text-[var(--color-text-secondary)]">Plantios simultâneos</dt>
                    <dd className="font-medium text-[var(--color-text)] tabular-nums">
                      {resultado.semanasSimultaneas}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                    <dt className="text-[var(--color-text-secondary)]">
                      {resultado.tipoPlantio === 'm2' ? 'Área total ocupada' : 'Total de plantas'}
                    </dt>
                    <dd className="font-medium text-[var(--color-text)] tabular-nums">
                      {resultado.tipoPlantio === 'm2'
                        ? `${resultado.areaTotalM2} m²`
                        : `${resultado.plantasTotal} plantas`
                      }
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-text-secondary)]">Colheita semanal estimada</dt>
                    <dd className="font-medium text-[var(--color-text)] tabular-nums">
                      {kgPorSemana} kg
                    </dd>
                  </div>
                </dl>
              </Card>

              <Card
                padding="md"
                className={`border-l-4 ${resultado.epocaRecomendada.toLowerCase().includes('inadequado') ? 'border-l-[var(--color-warning)]' : 'border-l-[var(--color-success)]'}`}
              >
                <p className={`text-sm leading-relaxed ${resultado.epocaRecomendada.toLowerCase().includes('inadequado') ? 'text-[var(--color-warning)]' : 'text-[var(--color-text)]'}`}>
                  {resultado.instrucaoPlantio}
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
