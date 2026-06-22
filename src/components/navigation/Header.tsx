"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const { user, loading, initialized, fetchProfile, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!initialized) fetchProfile();
  }, [initialized, fetchProfile]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/readings", label: "Leituras" },
    { href: "/manual-records", label: "Registros" },
    { href: "/alerts", label: "Alertas" },
    { href: "/calculator", label: "Calculadora" },
  ];

  const adminItems = [
    { href: "/admin/scheduler", label: "Scheduler" },
    { href: "/admin/iot", label: "IoT" },
    { href: "/admin/lessons", label: "Aulas" },
    { href: "/admin/docs", label: "Documentação" },
    { href: "/admin/users", label: "Usuários" },
  ];

  const isAdmin = user?.role === "SUPER_ADMIN";
  const allNavItems = [...navItems, ...(isAdmin ? adminItems : [])];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 py-3 text-base font-semibold text-[var(--color-text)] tracking-tight"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-xs font-bold text-white">
              S
            </span>
            Sisteminha
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {allNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-150
                  ${isActive(item.href)
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                  }
                `.trim()}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-5 w-5 animate-pulse rounded-full bg-[var(--color-border)]" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-150"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[10px] font-bold text-[var(--color-primary)]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden lg:inline">{user.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Cadastro</Button>
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-2 flex md:hidden h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Abrir menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 pb-3 pt-2 md:hidden">
          {allNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors duration-150
                ${isActive(item.href)
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                }
              `.trim()}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
