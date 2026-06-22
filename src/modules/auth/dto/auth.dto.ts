import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres.").max(120),
  email: z.string().email("E-mail inválido.").max(254),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres.").max(128),
  passwordConfirmation: z.string().min(1, "Confirmação de senha é obrigatória."),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Senhas não conferem.",
  path: ["passwordConfirmation"],
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido.").max(254),
  password: z.string().min(1, "Senha é obrigatória.").max(128),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres.").max(120).optional(),
  email: z.string().email("E-mail inválido.").max(254).optional(),
});
