"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Textarea } from "@/src/components/ui/Textarea";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { PageLoading } from "@/src/components/ui/Loading";
import { api } from "@/src/lib/api";
import { AuthGuard } from "@/src/components/auth/AuthGuard";

type Doc = { id: string; title: string; description: string; slug: string; createdAt: string };

function DocsContent() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchDocs = async () => {
    try { setDocs(await api<Doc[]>("/api/docs")); } catch { /* */ }
    setLoading(false);
  };
  useEffect(() => { fetchDocs(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      await api("/api/docs", { method: "POST", body: JSON.stringify({ title, description, content }) });
      setTitle(""); setDescription(""); setContent("");
      fetchDocs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar documento.");
    }
    setSubmitting(false);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Documentação" description="Gerenciar páginas de documentação." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Nova página</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <AlertBanner variant="error">{error}</AlertBanner>}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium text-[var(--color-text)]">Título</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-[var(--color-text)]">Descrição</label>
              <Textarea id="description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="content" className="text-sm font-medium text-[var(--color-text)]">Conteúdo</label>
              <Textarea id="content" rows={6} value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <Button type="submit" loading={submitting}>Criar página</Button>
          </form>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-[var(--color-text)]">Páginas existentes</h2>
          {loading ? <PageLoading /> : docs.length === 0 ? (
            <Card><p className="py-4 text-center text-sm text-[var(--color-text-tertiary)]">Nenhuma página cadastrada.</p></Card>
          ) : (
            docs.map((doc) => (
              <Card key={doc.id} padding="sm">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">{doc.title}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{doc.slug}</p>
                </div>
                <a href={`/docs/${doc.slug}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-medium text-[var(--color-primary)] hover:underline">
                  Ver página →
                </a>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default function AdminDocsPage() {
  return <AuthGuard><DocsContent /></AuthGuard>;
}
