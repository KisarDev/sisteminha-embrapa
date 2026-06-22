"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { PageLoading } from "@/src/components/ui/Loading";
import { api } from "@/src/lib/api";
import { AuthGuard } from "@/src/components/auth/AuthGuard";

type User = { id: string; name: string; email: string; role: "USER" | "SUPER_ADMIN"; createdAt: string };

function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchUsers = async () => {
    try { setUsers(await api<User[]>("/api/users")); } catch { setError("Erro ao carregar usuários."); }
    setLoading(false);
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    setDeleting(userId); setError("");
    try {
      await api(`/api/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir usuário.");
    }
    setDeleting(null);
  };

  if (loading) return <PageLoading />;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Usuários" description="Gerenciar usuários do sistema." />

      {error && <div className="rounded-[var(--radius-md)] bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-[var(--color-danger)] border border-[var(--color-danger)]/20">{error}</div>}

      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left">
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Nome</th>
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Email</th>
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Função</th>
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Criado em</th>
                <th className="pb-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="pt-4 text-center text-sm text-[var(--color-text-tertiary)]">Nenhum usuário encontrado.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-2.5 pr-4 text-[var(--color-text)] font-medium">{user.name}</td>
                    <td className="py-2.5 pr-4 text-[var(--color-text-secondary)]">{user.email}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={user.role === "SUPER_ADMIN" ? "neutral" : "info"}>
                        {user.role === "SUPER_ADMIN" ? "Admin" : "Usuário"}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-[var(--color-text-secondary)]">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="py-2.5">
                      <button onClick={() => handleDelete(user.id)} disabled={deleting === user.id}
                        className="text-xs text-[var(--color-danger)] hover:underline disabled:opacity-40">
                        {deleting === user.id ? "..." : "Excluir"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}

export default function AdminUsersPage() {
  return <AuthGuard><UsersContent /></AuthGuard>;
}
