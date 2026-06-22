"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

const CATEGORIES = [
  { value: "GENERAL", label: "Geral" },
  { value: "CHICKEN", label: "Galinhas" },
  { value: "QUAIL", label: "Codornas" },
  { value: "FISH", label: "Peixes" },
  { value: "COMPOST", label: "Composteira" },
  { value: "WORM_FARM", label: "Minhocário" },
  { value: "PLANTING", label: "Plantio" },
] as const;

type Lesson = {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  createdAt: string;
};

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLessons = async () => {
    const res = await fetch("/api/lessons");
    if (res.ok) {
      setLessons(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const body = {
      title,
      description,
      content,
      videoUrl,
      category,
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
    };

    const res = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Erro ao criar aula.");
      setSubmitting(false);
      return;
    }

    setTitle("");
    setDescription("");
    setContent("");
    setVideoUrl("");
    setCategory("GENERAL");
    setThumbnailUrl("");
    setSubmitting(false);
    fetchLessons();
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Admin - Aulas</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Gerenciar conteúdo das aulas.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-medium text-[var(--color-text)]">Nova aula</h2>
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
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="videoUrl" className="text-sm font-medium text-[var(--color-text)]">URL do vídeo</label>
              <Input id="videoUrl" type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-[var(--color-text)]">Categoria</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="thumbnailUrl" className="text-sm font-medium text-[var(--color-text)]">
                URL da thumbnail <span className="text-[var(--color-text-muted)]">(opcional)</span>
              </label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar aula"}
            </Button>
          </form>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-medium text-[var(--color-text)]">Aulas existentes</h2>
          {loading ? (
            <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">Nenhuma aula cadastrada.</p>
          ) : (
            lessons.map((lesson) => (
              <Card key={lesson.id}>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{lesson.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {lesson.slug} &middot; {CATEGORIES.find((c) => c.value === lesson.category)?.label || lesson.category}
                  </p>
                </div>
                <a
                  href={`/aulas/${lesson.slug}`}
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
