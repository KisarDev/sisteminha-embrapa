import { prisma } from "@/src/core/database/prisma";
import { IUserRepository, CreateUserInput, UpdateProfileInput } from "@/src/modules/auth/interfaces/IUserRepository";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, isDeleted: false } });
  }

  async findById(id: string) {
    return prisma.user.findFirst({ where: { id, isDeleted: false } });
  }

  async create(input: CreateUserInput) {
    return prisma.user.create({ data: input });
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    return prisma.user.update({ where: { id: userId }, data: input });
  }

  async softDelete(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
