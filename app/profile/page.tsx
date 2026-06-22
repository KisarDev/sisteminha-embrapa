"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Badge } from "@/src/components/ui/Badge";
import { PageLoading } from "@/src/components/ui/Loading";
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
    if (!initialized) fetchProfile();
  }, [initialized, fetchProfile]);

  useEffect(() => {
    if (initialized && !authLoading) {
      if (!user) { router.push("/login"); return; }
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, initialized, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);
    try {
      await updateProfile({ name, email });
      setSuccess("Perfil atualizado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar.");
    }
    setSaving(false);
  };

  if (!initialized || authLoading || !user) return <PageLoading />;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8">
      <PageHeader
        title="Meu Perfil"
        description={
          <span className="flex items-center gap-2">
            {user.email}
            <Badge variant={user.role === "SUPER_ADMIN" ? "neutral" : "info"}>
              {user.role === "SUPER_ADMIN" ? "Administrador" : "Usuário"}
            </Badge>
          </span>
        }
      />

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <AlertBanner variant="error">{error}</AlertBanner>}
          {success && <AlertBanner variant="success">{success}</AlertBanner>}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-[var(--color-text)]">Nome</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)]">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" loading={saving}>Salvar</Button>
        </form>
      </Card>
    </main>
  );
}
