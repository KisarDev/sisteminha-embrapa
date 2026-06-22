"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { PageLoading } from "@/src/components/ui/Loading";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, loading, initialized, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!initialized) fetchProfile();
  }, [initialized, fetchProfile]);

  if (loading || !initialized) return <PageLoading />;

  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return <PageLoading />;
  }

  return <>{children}</>;
}
