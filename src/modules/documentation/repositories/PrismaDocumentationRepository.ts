import { prisma } from "@/src/core/database/prisma";

export type DocumentationInput = {
  title: string;
  description: string;
  content: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export class PrismaDocumentationRepository {
  create(input: DocumentationInput) {
    return prisma.documentationPage.create({ data: { ...input, slug: slugify(input.title) } });
  }

  findMany() {
    return prisma.documentationPage.findMany({ where: { isDeleted: false }, orderBy: { createdAt: "desc" } });
  }

  findBySlug(slug: string) {
    return prisma.documentationPage.findFirst({ where: { slug, isDeleted: false } });
  }

  update(id: string, input: Partial<DocumentationInput>) {
    return prisma.documentationPage.update({
      where: { id },
      data: { ...input, ...(input.title ? { slug: slugify(input.title) } : {}) },
    });
  }

  async softDelete(id: string) {
    await prisma.documentationPage.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
  }
}
