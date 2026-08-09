import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ENTITY_META } from "./entity-meta";
import type { EntityType } from "@/data/types";

interface EntityChipProps {
  type: EntityType;
  label: string;
  id?: string;
  to?: string;
  params?: Record<string, string>;
  muted?: boolean;
  className?: string;
}

/** A relationship chip: the atomic unit of the whole product. */
export function EntityChip({ type, label, to, params, muted, className }: EntityChipProps) {
  const meta = ENTITY_META[type];
  const Icon = meta.icon;
  const body = (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        muted
          ? "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
          : cn("border-transparent", meta.soft, meta.text, "hover:brightness-105"),
        className,
      )}
    >
      <Icon className="size-3 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );

  if (!to) return body;

  let path = to;
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      path = path.replace(`$${key}`, val).replace(`:${key}`, val);
    });
  }

  return (
    <Link to={path} className="max-w-full">
      {body}
    </Link>
  );
}

export function EntityDot({ type, className }: { type: EntityType; className?: string }) {
  return (
    <span
      className={cn("inline-block size-2 shrink-0 rounded-full", className)}
      style={{ backgroundColor: ENTITY_META[type].color }}
    />
  );
}
