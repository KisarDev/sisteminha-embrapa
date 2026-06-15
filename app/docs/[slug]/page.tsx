import { notFound } from "next/navigation";
import { container } from "@/src/core/di/container";

export default async function DocumentationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await container.documentationRepository.findBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-3xl font-semibold">{page.title}</h1>
      <p className="text-gray-600">{page.description}</p>
      <article>{page.content}</article>
    </main>
  );
}
