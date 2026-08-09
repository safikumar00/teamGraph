import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, ErrorState } from "@/components/common/page-primitives";
import { MiniBar } from "@/components/common/stat-card";
import { EntityChip } from "@/components/entity/entity-chip";
import { useInsights } from "@/data/hooks";
import { cn } from "@/lib/utils";



const DETAIL: Record<string, { route: string; key: string }> = {
  employee: { route: "/employees/$employeeId", key: "employeeId" },
  project: { route: "/projects/$projectId", key: "projectId" },
  skill: { route: "/skills/$skillId", key: "skillId" },
  technology: { route: "/technologies/$technologyId", key: "technologyId" },
  client: { route: "/clients/$clientId", key: "clientId" },
};

const SEVERITY: Record<string, string> = {
  info: "border-border",
  positive: "border-success/35",
  warning: "border-warning/40",
  critical: "border-destructive/40",
};

const ACCENT: Record<string, string> = {
  info: "var(--color-primary)",
  positive: "var(--success)",
  warning: "var(--warning)",
  critical: "var(--destructive)",
};

function InsightsPage() {
  const insights = useInsights();
  if (insights.isError) return <ErrorState onRetry={() => insights.refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <PageHeader
        eyebrow="Graph analytics"
        title="Insights"
        description="Questions the graph can answer that a directory never could."
        actions={<Badge variant="secondary"><Lightbulb className="mr-1 size-3" /> {insights.data?.length ?? 0} findings</Badge>}
      />
      {insights.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(insights.data ?? []).map((card) => (
            <article key={card.id} className={cn("surface-panel hover-lift flex flex-col gap-3 p-5", SEVERITY[card.severity])}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">{card.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground italic">{card.question}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-xl font-semibold" style={{ color: ACCENT[card.severity] }}>{card.metric}</p>
                  <p className="text-[10px] text-muted-foreground">{card.metricLabel}</p>
                </div>
              </div>
              <p className="text-base font-semibold">{card.headline}</p>
              <p className="text-xs text-muted-foreground">{card.detail}</p>
              <MiniBar value={card.score} accent={ACCENT[card.severity]} />
              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {card.entities.map((e) => {
                  const target = DETAIL[e.type];
                  return target ? (
                    <EntityChip key={`${e.type}-${e.id}`} type={e.type} label={e.label} to={target.route} params={{ [target.key]: e.id }} />
                  ) : (
                    <EntityChip key={`${e.type}-${e.id}`} type={e.type} label={e.label} />
                  );
                })}
              </div>
              <Link to="/network" className="text-xs font-medium text-primary hover:underline">Investigate in Explorer →</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default InsightsPage;
