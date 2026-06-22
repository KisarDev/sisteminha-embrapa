import { SensorReadingStats } from "@/src/modules/iot/interfaces/ISensorReadingRepository";
import { Card } from "@/src/components/ui/Card";

type SensorCardProps = {
  title: string;
  stats: SensorReadingStats;
};

function formatValue(value: number | null) {
  if (value === null) return "—";
  return value.toFixed(1);
}

export function SensorCard({ title, stats }: SensorCardProps) {
  const latestValue = stats.latest?.value ?? null;

  return (
    <Card padding="sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            {formatValue(latestValue)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] text-[var(--color-text-tertiary)]">{stats.count} leituras</p>
          {stats.latest && (
            <p className="mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">
              {new Date(stats.latest.measuredAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-3">
        <div>
          <dt className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-wider">Média</dt>
          <dd className="mt-0.5 text-sm font-medium text-[var(--color-text)]">{formatValue(stats.average)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-wider">Mín</dt>
          <dd className="mt-0.5 text-sm font-medium text-[var(--color-text)]">{formatValue(stats.minimum)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-wider">Máx</dt>
          <dd className="mt-0.5 text-sm font-medium text-[var(--color-text)]">{formatValue(stats.maximum)}</dd>
        </div>
      </div>
    </Card>
  );
}
