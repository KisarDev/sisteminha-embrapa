import { User, UserRole } from "@prisma/client";

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
};

export type UpdateProfileInput = {
  name?: string;
  email?: string;
};

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findMany(): Promise<User[]>;
  create(input: CreateUserInput): Promise<User>;
  updateProfile(userId: string, input: UpdateProfileInput): Promise<User>;
  softDelete(userId: string): Promise<void>;
}
