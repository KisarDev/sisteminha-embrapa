import { AlertSeverity } from "@prisma/client";
import { Badge } from "@/src/components/ui/Badge";

const severityToVariant: Record<AlertSeverity, "neutral" | "warning" | "danger"> = {
  INFO: "neutral",
  WARNING: "warning",
  CRITICAL: "danger",
};

type AlertBadgeProps = {
  severity: AlertSeverity;
};

export function AlertBadge({ severity }: AlertBadgeProps) {
  return <Badge variant={severityToVariant[severity]}>{severity}</Badge>;
}
