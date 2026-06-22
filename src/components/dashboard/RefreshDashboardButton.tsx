"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";

export function RefreshDashboardButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetch("/api/iot/refresh", { method: "POST" });
      router.refresh();
    } catch {
      // silencio
    }
    setLoading(false);
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleRefresh} loading={loading}>
      Atualizar dados
    </Button>
  );
}
