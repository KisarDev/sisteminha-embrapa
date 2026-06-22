import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import { AppError } from "@/src/core/errors/AppError";

const AUTH_COOKIE = "sisteminha_auth";

type AuthPayload = {
  sub: string;
  role: UserRole;
};

const DEFAULT_SECRET = "your-super-secret-jwt-key-change-this-in-production";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(500, "JWT_SECRET não configurado.");
  }
  if (secret === DEFAULT_SECRET && process.env.NODE_ENV === "production") {
    throw new AppError(500, "JWT_SECRET não foi alterado do valor padrão. Configure uma chave segura.");
  }
  return secret;
}

export function signAuthToken(payload: AuthPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "12h" });
}

export function verifyAuthToken(token: string): AuthPayload {
  const payload = jwt.verify(token, getSecret());
  if (typeof payload === "string" || !payload.sub || !payload.role) {
    throw new AppError(401, "Token inválido.");
  }
  return payload as AuthPayload;
}

export async function readSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    throw new AppError(401, "Usuário não autenticado.");
  }

  return verifyAuthToken(token);
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await readSession();

  if (!allowedRoles.includes(session.role)) {
    throw new AppError(403, "Permissão negada.");
  }

  return session;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
