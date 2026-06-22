"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { api } from "@/src/lib/api";
import { AuthGuard } from "@/src/components/auth/AuthGuard";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "SUPER_ADMIN";
  createdAt: string;
};

function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await api<User[]>("/api/users");
      setUsers(data);
    } catch {
      setError("Erro ao carregar usuários.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    setDeleting(userId);
    setError("");
    try {
      await api(`/api/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir usuário.");
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-4xl p-6 pt-8">
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Admin - Usuários</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Gerenciar usuários do sistema.</p>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left">
                <th className="pb-2 font-medium text-[var(--color-text)]">Nome</th>
                <th className="pb-2 font-medium text-[var(--color-text)]">Email</th>
                <th className="pb-2 font-medium text-[var(--color-text)]">Função</th>
                <th className="pb-2 font-medium text-[var(--color-text)]">Criado em</th>
                <th className="pb-2 font-medium text-[var(--color-text)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="pt-4 text-center text-[var(--color-text-muted)]">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--color-border)]">
                    <td className="py-2 text-[var(--color-text)]">{user.name}</td>
                    <td className="py-2 text-[var(--color-text-muted)]">{user.email}</td>
                    <td className="py-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${user.role === "SUPER_ADMIN" ? "bg-slate-100 text-slate-700" : "bg-blue-100 text-blue-700"}`}>
                        {user.role === "SUPER_ADMIN" ? "Admin" : "Usuário"}
                      </span>
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-2">
                      <button onClick={() => handleDelete(user.id)} disabled={deleting === user.id}
                        className="text-sm text-red-600 transition hover:text-red-800 disabled:opacity-50">
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
  return (
    <AuthGuard>
      <UsersContent />
    </AuthGuard>
  );
}
