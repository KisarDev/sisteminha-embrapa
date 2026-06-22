"use client";

import { FormEvent, useEffect, useState } from "react";
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

const CATEGORIES = [
  { value: "GENERAL", label: "Geral" },
  { value: "CHICKEN", label: "Galinhas" },
  { value: "QUAIL", label: "Codornas" },
  { value: "FISH", label: "Peixes" },
  { value: "COMPOST", label: "Composteira" },
  { value: "WORM_FARM", label: "Minhocário" },
  { value: "PLANTING", label: "Plantio" },
] as const;

type Lesson = { id: string; title: string; description: string; slug: string; category: string; createdAt: string };

function LessonsContent() {
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
    try { setLessons(await api<Lesson[]>("/api/lessons")); } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => { fetchLessons(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      await api("/api/lessons", {
        method: "POST",
        body: JSON.stringify({ title, description, content, videoUrl, category, ...(thumbnailUrl ? { thumbnailUrl } : {}) }),
      });
      setTitle(""); setDescription(""); setContent(""); setVideoUrl(""); setCategory("GENERAL"); setThumbnailUrl("");
      fetchLessons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar aula.");
    }
    setSubmitting(false);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Aulas" description="Gerenciar conteúdo das aulas." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Nova aula</h2>
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
              <Textarea id="content" rows={4} value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="videoUrl" className="text-sm font-medium text-[var(--color-text)]">URL do vídeo</label>
              <Input id="videoUrl" type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-[var(--color-text)]">Categoria</label>
              <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="thumbnailUrl" className="text-sm font-medium text-[var(--color-text)]">URL da thumbnail <span className="text-[var(--color-text-tertiary)]">(opcional)</span></label>
              <Input id="thumbnailUrl" type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
            </div>
            <Button type="submit" loading={submitting}>Criar aula</Button>
          </form>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-[var(--color-text)]">Aulas existentes</h2>
          {loading ? <PageLoading /> : lessons.length === 0 ? (
            <Card><p className="py-4 text-center text-sm text-[var(--color-text-tertiary)]">Nenhuma aula cadastrada.</p></Card>
          ) : (
            lessons.map((lesson) => (
              <Card key={lesson.id} padding="sm">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">{lesson.title}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{lesson.slug} · {CATEGORIES.find((c) => c.value === lesson.category)?.label || lesson.category}</p>
                </div>
                <a href={`/aulas/${lesson.slug}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-medium text-[var(--color-primary)] hover:underline">
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

export default function AdminLessonsPage() {
  return <AuthGuard><LessonsContent /></AuthGuard>;
}
