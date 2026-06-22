"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
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
  { value: "FISH_HARVEST_AMOUNT", label: "Quantidade de peixes colhidos" },
  { value: "SLAUGHTERED_BIRDS_AMOUNT", label: "Quantidade de aves abatidas" },
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

type ViewMode = "cards" | "table";

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
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const fetchRecords = async () => {
    try {
      const data = await api<ManualRecord[]>("/api/manual-records");
      setRecords(data);
    } catch {
      // api() handles 401 redirect
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const body: { type: string; observedAt: string; quantity?: number; notes?: string } = {
      type,
      observedAt: new Date(observedAt).toISOString(),
    };
    if (quantity) body.quantity = parseFloat(quantity);
    if (notes) body.notes = notes;

    try {
      await api("/api/manual-records", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setType("OBSERVATION");
      setQuantity("");
      setNotes("");
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
    } catch {
      // api() handles errors
    }
  };

  const getTypeLabel = (typeValue: string) =>
    RECORD_TYPES.find((t) => t.value === typeValue)?.label || typeValue;

  const filteredRecords = useMemo(() => {
    let result = [...records];

    if (filterType) {
      result = result.filter((r) => r.type === filterType);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          (r.notes && r.notes.toLowerCase().includes(q)) ||
          getTypeLabel(r.type).toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      const diff = new Date(a.observedAt).getTime() - new Date(b.observedAt).getTime();
      return sortOrder === "desc" ? -diff : diff;
    });

    return result;
  }, [records, filterType, search, sortOrder]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Registros Manuais</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Registre observações de produção do sisteminha.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-medium text-[var(--color-text)]">Novo registro</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-medium text-[var(--color-text)]">Tipo</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
              >
                {RECORD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="quantity" className="text-sm font-medium text-[var(--color-text)]">
                Quantidade <span className="text-[var(--color-text-muted)]">(opcional)</span>
              </label>
              <Input
                id="quantity"
                type="number"
                step="any"
                placeholder="Ex: 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium text-[var(--color-text)]">
                Anotações <span className="text-[var(--color-text-muted)]">(opcional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Observações sobre o registro"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="observedAt" className="text-sm font-medium text-[var(--color-text)]">Data</label>
              <Input
                id="observedAt"
                type="datetime-local"
                value={observedAt}
                onChange={(e) => setObservedAt(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Registrar"}
            </Button>
          </form>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[var(--color-text)]">Registros recentes</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-2 py-1 text-xs rounded transition ${
                  viewMode === "cards"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted)] border border-[var(--color-border)]"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-2 py-1 text-xs rounded transition ${
                  viewMode === "table"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted)] border border-[var(--color-border)]"
                }`}
              >
                Tabela
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 min-w-[140px] rounded-md border border-[var(--color-border)] bg-white px-2 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            >
              <option value="">Todos os tipos</option>
              {RECORD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[140px] text-xs"
            />
            <button
              onClick={() => setSortOrder((s) => (s === "desc" ? "asc" : "desc"))}
              className="whitespace-nowrap rounded-md border border-[var(--color-border)] px-2 py-1.5 text-xs text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            >
              {sortOrder === "desc" ? "↓ Mais recentes" : "↑ Mais antigos"}
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              {records.length === 0 ? "Nenhum registro encontrado." : "Nenhum registro corresponde aos filtros."}
            </p>
          ) : viewMode === "cards" ? (
            filteredRecords.map((record) => (
              <Card key={record.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{getTypeLabel(record.type)}</p>
                    {record.quantity !== null && (
                      <p className="text-sm text-[var(--color-text-muted)]">Qtd: {record.quantity}</p>
                    )}
                    {record.notes && (
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{record.notes}</p>
                    )}
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {new Date(record.observedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="shrink-0 text-sm text-red-600 transition hover:text-red-800"
                  >
                    Excluir
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                    <th className="pb-2 pr-3 font-medium">Data</th>
                    <th className="pb-2 pr-3 font-medium">Tipo</th>
                    <th className="pb-2 pr-3 font-medium">Qtd</th>
                    <th className="pb-2 pr-3 font-medium">Anotações</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="py-2 pr-3 whitespace-nowrap text-[var(--color-text)]">
                        {new Date(record.observedAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="py-2 pr-3 text-[var(--color-text)]">{getTypeLabel(record.type)}</td>
                      <td className="py-2 pr-3 text-[var(--color-text)]">{record.quantity ?? "—"}</td>
                      <td className="py-2 pr-3 text-[var(--color-text-muted)] max-w-[200px] truncate">
                        {record.notes ?? "—"}
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-xs text-red-600 transition hover:text-red-800"
                        >
                          Excluir
                        </button>
                      </td>
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
  return (
    <AuthGuard>
      <ManualRecordsContent />
    </AuthGuard>
  );
}
