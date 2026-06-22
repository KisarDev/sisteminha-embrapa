"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RefreshDashboardButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetch("/api/iot/refresh", { method: "POST" });
      router.refresh();
    } catch {
      // Silently fail
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Atualizando..." : "Atualizar dados"}
    </button>
  );
}
