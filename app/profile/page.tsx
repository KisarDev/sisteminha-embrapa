"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { useAuthStore } from "@/src/store/authStore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, fetchProfile, updateProfile, initialized, loading: authLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!initialized) {
      fetchProfile();
    }
  }, [initialized, fetchProfile]);

  useEffect(() => {
    if (initialized && !authLoading) {
      if (!user) {
        router.push("/login");
        return;
      }
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, initialized, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProfile({ name, email });
      setSuccess("Perfil atualizado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar.");
    }
    setSaving(false);
  };

  if (!initialized || authLoading) {
    return (
      <main className="mx-auto flex w-full max-w-md p-6 pt-12">
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex w-full max-w-md p-6 pt-12">
        <p className="text-[var(--color-text-muted)]">Redirecionando...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 p-6 pt-12">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Meu Perfil</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {user.role === "SUPER_ADMIN" ? "Administrador" : "Usuário"}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          {success && (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-[var(--color-text)]">
              Nome
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
