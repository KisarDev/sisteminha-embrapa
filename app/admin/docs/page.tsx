"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

type Doc = {
  id: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
};

export default function AdminDocsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchDocs = async () => {
    const res = await fetch("/api/docs");
    if (res.ok) {
      setDocs(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/docs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, content }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Erro ao criar documento.");
      setSubmitting(false);
      return;
    }

    setTitle("");
    setDescription("");
    setContent("");
    setSubmitting(false);
    fetchDocs();
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Admin - Documentação</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Gerenciar páginas de documentação.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-medium text-[var(--color-text)]">Nova página</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium text-[var(--color-text)]">Título</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-[var(--color-text)]">Descrição</label>
              <textarea
                id="description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="content" className="text-sm font-medium text-[var(--color-text)]">Conteúdo</label>
              <textarea
                id="content"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar página"}
            </Button>
          </form>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-medium text-[var(--color-text)]">Páginas existentes</h2>
          {loading ? (
            <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>
          ) : docs.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">Nenhuma página cadastrada.</p>
          ) : (
            docs.map((doc) => (
              <Card key={doc.id}>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{doc.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{doc.slug}</p>
                </div>
                <a
                  href={`/docs/${doc.slug}`}
                  target="_blank"
                  className="mt-2 inline-block text-sm text-[var(--color-primary)] underline"
                >
                  Ver página
                </a>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
