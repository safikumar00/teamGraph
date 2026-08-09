import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  accent = "var(--primary)",
  children,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
  hint?: string;
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <div className="surface-panel hover-lift group relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -top-16 -right-10 size-36 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-300 group-hover:opacity-25"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 font-mono text-3xl leading-none font-semibold text-foreground tabular-nums">
            {value}
          </p>
        </div>
        <span
          className="grid size-9 shrink-0 place-items-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}
        >
          <Icon className="size-4" />
        </span>
      </div>
      {delta ? (
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-success">
          <TrendingUp className="size-3" />
          {delta}
          {hint ? <span className="text-muted-foreground">· {hint}</span> : null}
        </p>
      ) : hint ? (
        <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export function MiniBar({ value, accent }: { value: number; accent?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-[width] duration-700")}
        style={{ width: `${Math.min(100, Math.max(3, value))}%`, backgroundColor: accent ?? "var(--primary)" }}
      />
    </div>
  );
}
