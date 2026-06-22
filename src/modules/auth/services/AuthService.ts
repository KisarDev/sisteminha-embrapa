import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { AppError } from "@/src/core/errors/AppError";
import { signAuthToken } from "@/src/core/http/auth";
import { IUserRepository } from "@/src/modules/auth/interfaces/IUserRepository";
import { loginSchema, registerSchema, updateProfileSchema } from "@/src/modules/auth/dto/auth.dto";

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(input: unknown) {
    const parsed = registerSchema.parse(input);
    const existingUser = await this.userRepository.findByEmail(parsed.email);

    if (existingUser) {
      throw new AppError(409, "E-mail já cadastrado.");
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);
    const user = await this.userRepository.create({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: parsed.role ?? UserRole.USER,
    });

    return {
      user,
      token: signAuthToken({ sub: user.id, role: user.role }),
    };
  }

  async login(input: unknown) {
    const parsed = loginSchema.parse(input);
    const user = await this.userRepository.findByEmail(parsed.email);

    if (!user || !(await bcrypt.compare(parsed.password, user.passwordHash))) {
      throw new AppError(401, "Credenciais inválidas.");
    }

    return {
      user,
      token: signAuthToken({ sub: user.id, role: user.role }),
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, "Usuário não encontrado.");
    }

    return user;
  }

  async updateProfile(userId: string, input: unknown) {
    const parsed = updateProfileSchema.parse(input);
    return this.userRepository.updateProfile(userId, parsed);
  }

  async softDeleteUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, "Usuário não encontrado.");
    }

    await this.userRepository.softDelete(userId);
  }

  async listUsers() {
    return this.userRepository.findMany();
  }
}
