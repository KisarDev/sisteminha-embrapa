import Link from "next/link";
import { Card } from "@/src/components/ui/Card";

const modules = [
  { title: "Dashboard", description: "Resumo dos sensores com médias, mínimas, máximas e alertas ativos.", href: "/dashboard" },
  { title: "Leituras IoT", description: "Histórico de dados coletados pelos sensores IoT em tempo real.", href: "/readings" },
  { title: "Registros", description: "CRUD de registros manuais com busca, filtro e visualização em cards/tabela.", href: "/manual-records" },
  { title: "Alertas", description: "Alertas gerados automaticamente por leituras fora dos thresholds.", href: "/alerts" },
  { title: "Calculadora", description: "Escalonamento de produção extensível por cultura.", href: "/calculator" },
  { title: "Aulas & Documentação", description: "CMS com aulas e documentação em rotas dinâmicas.", href: "/aulas/exemplo-aula" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-lg font-bold text-white">
            S
          </span>
          <div>
            <h1 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
              Sisteminha Embrapa
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Monitoramento IoT, registros e apoio à decisão para produtores.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link key={mod.title} href={mod.href} className="group block">
            <Card className="h-full transition-all duration-200 group-hover:shadow-[var(--shadow-md)] group-hover:border-[var(--color-border-hover)]">
              <h2 className="text-base font-semibold text-[var(--color-text)]">{mod.title}</h2>
              <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] leading-relaxed">{mod.description}</p>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
