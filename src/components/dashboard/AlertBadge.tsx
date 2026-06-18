import { AlertSeverity } from "@prisma/client";

const severityClassName: Record<AlertSeverity, string> = {
  INFO: "bg-slate-100 text-slate-700",
  WARNING: "bg-amber-100 text-amber-800",
  CRITICAL: "bg-red-100 text-red-800",
};

type AlertBadgeProps = {
  severity: AlertSeverity;
};

export function AlertBadge({ severity }: AlertBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${severityClassName[severity]}`}>
      {severity}
    </span>
  );
}