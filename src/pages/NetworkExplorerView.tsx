import { useMemo, useState } from "react";
import { Code2, Filter, Network, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PageHeader, EmptyState, StatRow } from "@/components/common/page-primitives";
import { GraphCanvas, GraphLegend } from "@/components/graph/graph-canvas";
import { ENTITY_META } from "@/components/entity/entity-meta";
import { EntityChip } from "@/components/entity/entity-chip";
import { useGraph } from "@/data/hooks";
import { useDirectory } from "@/data/directory";
import type { EntityType } from "@/data/types";

const FILTERS: EntityType[] = ["employee", "project", "technology", "skill", "team", "client"];

const QUERIES = [
  "MATCH (e:Employee)-[:WORKED_ON]->(p:Project) RETURN e, p",
  "MATCH (e)-[:HAS_SKILL]->(s:Skill) WHERE s.rarity = 'Critical'",
  "MATCH (a)-[:MENTORED*1..3]->(b) RETURN path",
  "MATCH (p:Project)-[:DEPENDS_ON]->(d:Project) RETURN p, d",
];

export default function NetworkExplorerView() {
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<EntityType[]>(["employee", "project", "technology", "skill", "team"]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const graph = useGraph({ query, types });
  const dir = useDirectory();

  const selected = useMemo(
    () => graph.data?.nodes.find((n) => n.id === selectedId) ?? null,
    [graph.data, selectedId],
  );

  const connected = useMemo(() => {
    if (!graph.data || !selectedId) return [];
    return graph.data.edges
      .filter((e) => e.source === selectedId || e.target === selectedId)
      .map((e) => {
        const otherId = e.source === selectedId ? e.target : e.source;
        const node = graph.data!.nodes.find((n) => n.id === otherId);
        return node ? { node, relationship: e.type } : null;
      })
      .filter(Boolean) as { node: NonNullable<typeof selected>; relationship: string }[];
  }, [graph.data, selectedId]);

  const toggle = (t: EntityType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5">
      <PageHeader
        eyebrow="Core surface"
        title="Network Explorer"
        description="Filter the organizational graph, select a node and inspect its relationships."
        actions={<Badge variant="secondary">{graph.data?.nodes.length ?? 0} nodes · {graph.data?.edges.length ?? 0} edges</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)_20rem]">
        <aside className="surface-panel h-fit space-y-5 p-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="graph-search">Search nodes</label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="graph-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter the graph…"
                className="pl-9"
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Filter className="size-3.5" /> Node types
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((t) => {
                const meta = ENTITY_META[t];
                const active = types.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggle(t)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${active ? "border-transparent text-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}
                    style={active ? { backgroundColor: `color-mix(in oklab, ${meta.color} 16%, transparent)`, color: meta.color } : undefined}
                  >
                    <span className="size-2 rounded-full" style={{ backgroundColor: meta.color }} />
                    {meta.plural}
                  </button>
                );
              })}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Legend</p>
            <GraphLegend />
          </div>
        </aside>

        <div className="surface-panel relative min-h-[26rem] overflow-hidden xl:min-h-[38rem]">
          {graph.isLoading ? (
            <Skeleton className="absolute inset-0" />
          ) : graph.data && graph.data.nodes.length > 0 ? (
            <GraphCanvas snapshot={graph.data} selectedId={selectedId} onSelect={setSelectedId} />
          ) : (
            <div className="grid h-full place-items-center p-6">
              <EmptyState title="No nodes match this view" description="Adjust filters or clear the search to bring the graph back." />
            </div>
          )}
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border bg-background/85 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
            layout: radial · engine: CognoDB live
          </div>
        </div>

        <aside className="surface-panel h-fit space-y-4 p-4">
          <div className="flex items-center gap-2">
            <Network className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Details</p>
          </div>
          {!selected ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              Select a node in the canvas to inspect its properties and relationships.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <EntityChip type={selected.type} label={ENTITY_META[selected.type].label} />
                <p className="mt-2 text-base font-semibold break-words">{selected.label}</p>
              </div>
              <div className="rounded-lg border border-border/80 p-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Properties</p>
                <StatRow label="Node id" value={<span className="font-mono text-xs">{selected.id}</span>} />
                <StatRow label="Type" value={ENTITY_META[selected.type].label} />
                <StatRow label="Degree" value={connected.length} />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Connected items</p>
                <div className="flex flex-wrap gap-1.5">
                  {connected.slice(0, 12).map(({ node }) => (
                    <button key={node.id} type="button" onClick={() => setSelectedId(node.id)}>
                      <EntityChip type={node.type} label={node.label} />
                    </button>
                  ))}
                  {connected.length === 0 ? <p className="text-xs text-muted-foreground">No edges in the current view.</p> : null}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Relationship summary</p>
                <div className="space-y-1">
                  {Object.entries(
                    connected.reduce<Record<string, number>>((acc, c) => {
                      acc[c.relationship] = (acc[c.relationship] ?? 0) + 1;
                      return acc;
                    }, {}),
                  ).map(([rel, count]) => (
                    <StatRow key={rel} label={<span className="font-mono text-xs">{rel}</span> as unknown as string} value={count} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <Separator />
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Code2 className="size-3.5" /> Cypher queries
            </p>
            <div className="mt-2 space-y-1.5">
              {QUERIES.map((q) => (
                <p key={q} className="scroll-slim overflow-x-auto rounded-md border border-border bg-muted/50 px-2.5 py-2 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                  {q}
                </p>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full" disabled>
              <Sparkles className="size-3.5" /> Run query (CognoDB ready)
            </Button>
          </div>
          {dir.isLoading ? <Skeleton className="h-4 w-full" /> : null}
        </aside>
      </div>
    </div>
  );
}
