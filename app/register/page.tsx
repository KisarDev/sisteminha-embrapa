"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { useAuthStore } from "@/src/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-sm flex-col items-center justify-center px-4">
      <div className="w-full">
        <PageHeader title="Criar conta" description="Cadastre-se no Sisteminha." />
        <Card className="mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <AlertBanner variant="error">{error}</AlertBanner>}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-[var(--color-text)]">Nome</label>
              <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)]">Email</label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[var(--color-text)]">Senha</label>
              <Input id="password" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Cadastrar
            </Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
            Entre
          </Link>
        </p>
      </div>
    </main>
  );
}
