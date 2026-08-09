import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ENTITY_META } from "@/components/entity/entity-meta";
import type { GraphSnapshot } from "@/data/types";

interface GraphCanvasProps {
  snapshot: GraphSnapshot;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  /** Rendering is intentionally presentational — layout comes from the data layer. */
}

/**
 * Graph canvas.
 *
 * Renders nodes/edges from a `GraphSnapshot` using pre-computed coordinates so
 * a real layout/physics engine (or CognoDB-provided positions) can be dropped
 * in without touching this component's API.
 */
export function GraphCanvas({ snapshot, selectedId, onSelect, className }: GraphCanvasProps) {
  const nodeById = useMemo(
    () => new Map(snapshot.nodes.map((n) => [n.id, n])),
    [snapshot.nodes],
  );

  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-xl bg-card", className)}>
      <div className="grid-veil absolute inset-0 opacity-60" />
      <div className="gradient-veil absolute inset-0" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {snapshot.edges.map((edge) => {
          const a = nodeById.get(edge.source);
          const b = nodeById.get(edge.target);
          if (!a || !b) return null;
          const active = selectedId === a.id || selectedId === b.id;
          return (
            <line
              key={edge.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={active ? "var(--primary)" : "var(--border)"}
              strokeWidth={active ? 0.35 : 0.18}
              strokeOpacity={selectedId && !active ? 0.35 : 0.9}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {snapshot.nodes.map((node) => {
        const meta = ENTITY_META[node.type];
        const Icon = meta.icon;
        const isSelected = selectedId === node.id;
        const dimmed = Boolean(selectedId) && !isSelected;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelect?.(node.id)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={cn(
              "group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              "transition-all duration-300",
              dimmed && "opacity-45",
            )}
            aria-label={`${meta.label}: ${node.label}`}
          >
            <span
              className={cn(
                "grid place-items-center rounded-full border-2 border-card shadow-card transition-transform duration-200 group-hover:scale-115",
                isSelected && "scale-115 ring-2 ring-primary ring-offset-2 ring-offset-card",
              )}
              style={{
                width: `${node.size * 2.1}px`,
                height: `${node.size * 2.1}px`,
                backgroundColor: `color-mix(in oklab, ${meta.color} 22%, var(--card))`,
                color: meta.color,
              }}
            >
              <Icon style={{ width: node.size * 0.95, height: node.size * 0.95 }} />
            </span>
            <span
              className={cn(
                "pointer-events-none absolute top-full left-1/2 mt-1 hidden -translate-x-1/2 rounded-md border border-border bg-popover px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-popover-foreground shadow-float md:block",
                !isSelected && "opacity-0 transition-opacity group-hover:opacity-100",
              )}
            >
              {node.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {(Object.keys(ENTITY_META) as (keyof typeof ENTITY_META)[])
        .filter((k) => k !== "certification")
        .map((key) => (
          <span key={key} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ backgroundColor: ENTITY_META[key].color }} />
            {ENTITY_META[key].plural}
          </span>
        ))}
    </div>
  );
}
