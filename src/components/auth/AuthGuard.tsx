"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";

type AuthGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { user, loading, initialized, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      fetchProfile();
    }
  }, [initialized, fetchProfile]);

  if (loading || !initialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[var(--color-text-muted)]">Redirecionando para login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
