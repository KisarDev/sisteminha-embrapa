"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "SUPER_ADMIN";
};

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const isAdmin = user?.role === "SUPER_ADMIN";
  const adminLinks = [
    { href: "/admin/scheduler", label: "Scheduler" },
    { href: "/admin/iot", label: "IoT" },
    { href: "/admin/lessons", label: "Aulas" },
    { href: "/admin/docs", label: "Documentação" },
    { href: "/admin/users", label: "Usuários" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-[var(--color-text)]">
            Sisteminha
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition hover:text-[var(--color-primary)] ${
                  pathname === link.href ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <div className="relative group">
                <span className="cursor-pointer text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]">
                  Admin
                </span>
                <div className="absolute left-0 top-full mt-1 hidden w-40 rounded-md border border-[var(--color-border)] bg-white shadow-lg group-hover:block">
                  {adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2 text-sm transition hover:bg-[var(--color-surface)] ${
                        pathname === link.href ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-[var(--color-text-muted)]">...</span>
          ) : user ? (
            <>
              <Link
                href="/profile"
                className={`text-sm transition hover:text-[var(--color-primary)] ${
                  pathname === "/profile" ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                {user.name}
              </Link>
              <Link
                href="/manual-records"
                className={`text-sm transition hover:text-[var(--color-primary)] ${
                  pathname === "/manual-records" ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                Registros
              </Link>
              <Link
                href="/calculator"
                className={`text-sm transition hover:text-[var(--color-primary)] ${
                  pathname === "/calculator" ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                Calculadora
              </Link>
              <Link
                href="/alerts"
                className={`text-sm transition hover:text-[var(--color-primary)] ${
                  pathname === "/alerts" ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                Alertas
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-sm text-white transition hover:opacity-90"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm transition hover:text-[var(--color-primary)] ${
                  pathname === "/login" ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-sm text-white transition hover:opacity-90"
              >
                Cadastro
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
