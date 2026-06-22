import { useAuthStore } from "@/src/store/authStore";

type ApiOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function api<T>(url: string, options?: ApiOptions): Promise<T> {
  const { params, ...fetchOptions } = options ?? {};

  let finalUrl = url;
  if (params) {
    const searchParams = new URLSearchParams(params);
    finalUrl += `?${searchParams.toString()}`;
  }

  const res = await fetch(finalUrl, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions?.headers,
    },
  });

  if (res.status === 401) {
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Não autenticado.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Erro inesperado." }));
    throw new Error(err.message);
  }

  return res.json();
}
