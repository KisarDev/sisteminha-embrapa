import { notFound } from "next/navigation";
import { container } from "@/src/core/di/container";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await container.lessonRepository.findBySlug(slug);

  if (!lesson) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-3xl font-semibold">{lesson.title}</h1>
      <p className="text-gray-600">{lesson.description}</p>
      <p>{lesson.content}</p>
      <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] underline">
        Assistir vídeo
      </a>
    </main>
  );
}
