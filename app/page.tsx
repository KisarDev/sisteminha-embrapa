import Link from "next/link";
import { Card } from "@/src/components/ui/Card";

const modules = [
  { title: "Autenticação", description: "Cadastro, login, logout e perfil." },
  { title: "IoT", description: "Leitura simulada/real via IIotProvider com histórico." },
  { title: "Registros", description: "CRUD de registros manuais com soft delete." },
  { title: "Calculator", description: "Escalonamento de produção extensível por cultura." },
  { title: "CMS", description: "Aulas e documentação com rotas dinâmicas." },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">Sistema Inteligente para o Sisteminha Embrapa</h1>
        <p className="text-[var(--color-text-muted)]">Base arquitetural em Next.js + MVC + Service Layer + Repository Pattern + DI.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map((moduleItem) => (
          <Card key={moduleItem.title}>
            <h2 className="text-xl font-medium text-[var(--color-text)]">{moduleItem.title}</h2>
            <p className="mt-2 text-[var(--color-text-muted)]">{moduleItem.description}</p>
          </Card>
        ))}
      </section>

      <section className="flex flex-wrap gap-4 text-sm">
        <Link className="text-[var(--color-primary)] underline" href="/aulas/exemplo-aula">
          Exemplo de rota de aula
        </Link>
        <Link className="text-[var(--color-primary)] underline" href="/docs/exemplo-documentacao">
          Exemplo de rota de documentação
        </Link>
      </section>
    </main>
  );
}
