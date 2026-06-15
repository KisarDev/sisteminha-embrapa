import { LessonCategory } from "@prisma/client";
import { prisma } from "@/src/core/database/prisma";

export type LessonInput = {
  title: string;
  description: string;
  videoUrl: string;
  category: LessonCategory;
  thumbnailUrl?: string;
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

export class PrismaLessonRepository {
  create(input: LessonInput) {
    return prisma.lesson.create({ data: { ...input, slug: slugify(input.title) } });
  }

  findMany() {
    return prisma.lesson.findMany({ where: { isDeleted: false }, orderBy: { createdAt: "desc" } });
  }

  findBySlug(slug: string) {
    return prisma.lesson.findFirst({ where: { slug, isDeleted: false } });
  }

  update(id: string, input: Partial<LessonInput>) {
    return prisma.lesson.update({
      where: { id },
      data: { ...input, ...(input.title ? { slug: slugify(input.title) } : {}) },
    });
  }

  async softDelete(id: string) {
    await prisma.lesson.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
  }
}
