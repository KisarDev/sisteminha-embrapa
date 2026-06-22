"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Select } from "@/src/components/ui/Select";
import { Textarea } from "@/src/components/ui/Textarea";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { PageHeader } from "@/src/components/ui/PageHeader";

import { PageLoading } from "@/src/components/ui/Loading";
import { api } from "@/src/lib/api";
import { AuthGuard } from "@/src/components/auth/AuthGuard";

const RECORD_TYPES = [
  { value: "CHICKEN_EGGS", label: "Ovos de galinha" },
  { value: "QUAIL_EGGS", label: "Ovos de codorna" },
  { value: "CHICKEN_FEED_CONVERSION", label: "Conversão alimentar (galinhas)" },
  { value: "QUAIL_FEED_CONVERSION", label: "Conversão alimentar (codornas)" },
  { value: "FISH_FEED_CONVERSION", label: "Conversão alimentar (peixes)" },
  { value: "HUMUS_AMOUNT", label: "Quantidade de húmus" },
  { value: "COMPOST_AMOUNT", label: "Quantidade de composto" },
  { value: "FISH_HARVEST_AMOUNT", label: "Peixes colhidos" },
  { value: "SLAUGHTERED_BIRDS_AMOUNT", label: "Aves abatidas" },
  { value: "PLANTING_EVENT", label: "Evento de plantio" },
  { value: "HARVEST_EVENT", label: "Evento de colheita" },
  { value: "SEED_AMOUNT", label: "Quantidade de sementes" },
  { value: "OBSERVATION", label: "Observação" },
  { value: "FREE_NOTE", label: "Anotação livre" },
] as const;

type ManualRecord = {
  id: string;
  type: string;
  quantity: number | null;
  notes: string | null;
  observedAt: string;
  createdAt: string;
};

function ManualRecordsContent() {
  const [records, setRecords] = useState<ManualRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("OBSERVATION");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [observedAt, setObservedAt] = useState(new Date().toISOString().slice(0, 16));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const fetchRecords = async () => {
    try {
      setRecords(await api<ManualRecord[]>("/api/manual-records"));
    } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api("/api/manual-records", {
        method: "POST",
        body: JSON.stringify({
          type,
          observedAt: new Date(observedAt).toISOString(),
          ...(quantity ? { quantity: parseFloat(quantity) } : {}),
          ...(notes ? { notes } : {}),
        }),
      });
      setType("OBSERVATION"); setQuantity(""); setNotes("");
      setObservedAt(new Date().toISOString().slice(0, 16));
      fetchRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar registro.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api(`/api/manual-records/${id}`, { method: "DELETE" });
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch { /* */ }
  };

  const getTypeLabel = (v: string) => RECORD_TYPES.find((t) => t.value === v)?.label || v;

  const filtered = useMemo(() => {
    let r = [...records];
    if (filterType) r = r.filter((x) => x.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((x) => (x.notes?.toLowerCase() ?? "").includes(q) || getTypeLabel(x.type).toLowerCase().includes(q));
    }
    r.sort((a, b) => (sortOrder === "desc" ? -1 : 1) * (new Date(a.observedAt).getTime() - new Date(b.observedAt).getTime()));
    return r;
  }, [records, filterType, search, sortOrder]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Registros Manuais" description="Observações de produção do sisteminha." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Novo registro</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <AlertBanner variant="error">{error}</AlertBanner>}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-medium text-[var(--color-text)]">Tipo</label>
              <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                {RECORD_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quantity" className="text-sm font-medium text-[var(--color-text)]">Quantidade <span className="text-[var(--color-text-tertiary)]">(opcional)</span></label>
              <Input id="quantity" type="number" step="any" placeholder="Ex: 10" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium text-[var(--color-text)]">Anotações <span className="text-[var(--color-text-tertiary)]">(opcional)</span></label>
              <Textarea id="notes" rows={3} placeholder="Observações sobre o registro" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="observedAt" className="text-sm font-medium text-[var(--color-text)]">Data</label>
              <Input id="observedAt" type="datetime-local" value={observedAt} onChange={(e) => setObservedAt(e.target.value)} required />
            </div>
            <Button type="submit" loading={submitting}>Registrar</Button>
          </form>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Registros recentes</h2>
            <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] p-0.5">
              <button onClick={() => setViewMode("cards")} className={`px-2.5 py-1 text-xs rounded-[var(--radius-sm)] font-medium transition-colors ${viewMode === "cards" ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}>Cards</button>
              <button onClick={() => setViewMode("table")} className={`px-2.5 py-1 text-xs rounded-[var(--radius-sm)] font-medium transition-colors ${viewMode === "table" ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}>Tabela</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="min-w-[160px]">
              <option value="">Todos os tipos</option>
              {RECORD_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </Select>
            <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-[140px]" />
            <Button variant="secondary" size="sm" onClick={() => setSortOrder((s) => (s === "desc" ? "asc" : "desc"))}>
              {sortOrder === "desc" ? "↓ Mais recentes" : "↑ Mais antigos"}
            </Button>
          </div>

          {loading ? <PageLoading /> : filtered.length === 0 ? (
            <Card>
              <p className="py-4 text-center text-sm text-[var(--color-text-tertiary)]">Nenhum registro encontrado.</p>
            </Card>
          ) : viewMode === "cards" ? (
            filtered.map((record) => (
              <Card key={record.id} padding="sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">{getTypeLabel(record.type)}</p>
                    {record.quantity !== null && <p className="text-xs text-[var(--color-text-secondary)]">Qtd: {record.quantity}</p>}
                    {record.notes && <p className="text-xs text-[var(--color-text-secondary)]">{record.notes}</p>}
                    <p className="text-xs text-[var(--color-text-tertiary)]">{new Date(record.observedAt).toLocaleString("pt-BR")}</p>
                  </div>
                  <button onClick={() => handleDelete(record.id)} className="shrink-0 text-xs text-[var(--color-danger)] hover:underline">Excluir</button>
                </div>
              </Card>
            ))
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-left">
                    <th className="pb-3 pr-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Data</th>
                    <th className="pb-3 pr-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Tipo</th>
                    <th className="pb-3 pr-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Qtd</th>
                    <th className="pb-3 pr-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Anotações</th>
                    <th className="pb-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((record) => (
                    <tr key={record.id} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="py-2.5 pr-3 whitespace-nowrap text-[var(--color-text)]">{new Date(record.observedAt).toLocaleString("pt-BR")}</td>
                      <td className="py-2.5 pr-3 text-[var(--color-text)]">{getTypeLabel(record.type)}</td>
                      <td className="py-2.5 pr-3 text-[var(--color-text)]">{record.quantity ?? "—"}</td>
                      <td className="py-2.5 pr-3 text-[var(--color-text-secondary)] max-w-[200px] truncate">{record.notes ?? "—"}</td>
                      <td className="py-2.5"><button onClick={() => handleDelete(record.id)} className="text-xs text-[var(--color-danger)] hover:underline">Excluir</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ManualRecordsPage() {
  return <AuthGuard><ManualRecordsContent /></AuthGuard>;
}
