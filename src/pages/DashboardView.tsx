import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Building2,
  Cpu,
  FolderKanban,
  GitBranch,
  GraduationCap,
  Network,
  Search,
  Sparkles,
  Users,
  Waypoints,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader, SectionCard, ErrorState, StatRow } from "@/components/common/page-primitives";
import { StatCard, MiniBar } from "@/components/common/stat-card";
import { EntityChip } from "@/components/entity/entity-chip";
import { RiskPill, StatusBadge } from "@/components/entity/project-card";
import { useActivity, useInsights, useStats } from "@/data/hooks";
import { useDirectory } from "@/data/directory";
import { useCommandPalette } from "@/components/search/command-palette-context";
import { ENTITY_META } from "@/components/entity/entity-meta";

export default function DashboardView() {
  const stats = useStats();
  const activity = useActivity();
  const insights = useInsights();
  const dir = useDirectory();
  const { setOpen } = useCommandPalette();

  if (stats.isError) return <ErrorState onRetry={() => stats.refetch()} />;

  const mostConnected = [...dir.employees].sort((a, b) => b.connections - a.connections)[0];
  const mostCollaborative = [...dir.teams].sort(
    (a, b) => b.collaboratesWith.length - a.collaboratesWith.length,
  )[0];
  const topTech = [...dir.technologies].sort((a, b) => b.adoption - a.adoption)[0];
  const topMentor = [...dir.employees].sort((a, b) => b.menteeIds.length - a.menteeIds.length)[0];
  const dependencyProjects = [...dir.projects]
    .sort((a, b) => b.dependsOn.length - a.dependsOn.length)
    .slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <PageHeader
        eyebrow="Organization overview"
        title="Relationship Intelligence"
        description="Everything below is derived from graph relationships, not headcount records."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              <Search className="size-4" /> Quick search
            </Button>
            <Button asChild size="sm">
              <Link to="/network">
                <Network className="size-4" /> Open Explorer
              </Link>
            </Button>
          </>
        }
      />

      {stats.isLoading || !stats.data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <StatCard label="Employees" value={stats.data.employees} icon={Users} delta="+4 this month (Demo Data)" accent="var(--entity-employee)" />
          <StatCard label="Projects" value={stats.data.projects} icon={FolderKanban} hint="Across 16 projects" accent="var(--entity-project)" />
          <StatCard label="Teams" value={stats.data.teams} icon={Boxes} hint="8 teams" accent="var(--entity-team)" />
          <StatCard label="Skills" value={stats.data.skills} icon={Sparkles} hint="24 skills" accent="var(--entity-skill)" />
          <StatCard label="Technologies" value={stats.data.technologies} icon={Cpu} hint="14 technologies" accent="var(--entity-technology)" />
          <StatCard label="Relationships" value={stats.data.relationships} icon={Waypoints} delta="+12.4% (Demo Data)" accent="var(--primary)" />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        <HighlightCard
          icon={Network}
          label="Most connected employee"
          title={mostConnected?.name ?? "—"}
          subtitle={mostConnected?.role}
          metric={`${mostConnected?.connections ?? 0} edges`}
          score={Math.min(100, (mostConnected?.connections ?? 0) * 4)}
          to={mostConnected ? { path: "/employees/$employeeId", params: { employeeId: mostConnected.id } } : undefined}
          accent="var(--entity-employee)"
        />
        <HighlightCard
          icon={Boxes}
          label="Most collaborative team"
          title={mostCollaborative?.name ?? "—"}
          subtitle={mostCollaborative?.focus}
          metric={`${mostCollaborative?.collaboratesWith.length ?? 0} partner teams`}
          score={Math.min(100, (mostCollaborative?.collaboratesWith.length ?? 0) * 14)}
          to={{ path: "/teams" }}
          accent="var(--entity-team)"
        />
        <HighlightCard
          icon={Cpu}
          label="Most used technology"
          title={topTech?.name ?? "—"}
          subtitle={`${topTech?.projectIds.length ?? 0} projects`}
          metric={`${topTech?.adoption ?? 0}% adoption`}
          score={topTech?.adoption ?? 0}
          to={topTech ? { path: "/technologies/$technologyId", params: { technologyId: topTech.id } } : undefined}
          accent="var(--entity-technology)"
        />
        <HighlightCard
          icon={GraduationCap}
          label="Most experienced mentor"
          title={topMentor?.name ?? "—"}
          subtitle={`${topMentor?.experienceYears ?? 0} years experience`}
          metric={`${topMentor?.menteeIds.length ?? 0} mentees`}
          score={Math.min(100, (topMentor?.menteeIds.length ?? 0) * 22)}
          to={topMentor ? { path: "/employees/$employeeId", params: { employeeId: topMentor.id } } : undefined}
          accent="var(--entity-skill)"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Project dependency overview"
          description="Projects with the deepest dependency chains"
          icon={GitBranch}
          className="xl:col-span-2"
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-border">
            {dependencyProjects.map((p) => (
              <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <Link
                    to={`/projects/${p.id}`}
                    className="block truncate text-sm font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{p.code}</span>
                    <RiskPill risk={p.risk} />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant="secondary">{p.dependsOn.length} deps</Badge>
                  <StatusBadge status={p.status} />
                  <div className="hidden w-24 sm:block">
                    <Progress value={p.progress} className="h-1.5" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Relationship mix" description="Edges by type" icon={Waypoints} bodyClassName="h-72 p-3">
          {stats.data ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.data.relationshipMix.slice(0, 6)}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 26, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="type"
                  width={92}
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  cursor={{ fill: "color-mix(in oklab, var(--muted) 60%, transparent)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={4} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </SectionCard>
        <SectionCard
          title="Graph activity"
          description="Latest relationships recorded in the live graph"
          icon={Activity}
          className="xl:col-span-2"
          bodyClassName="p-0 h-72 overflow-y-auto"
        >
          {activity.isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {(activity.data ?? []).slice(0, 8).map((event) => {
                const meta = ENTITY_META[event.target.type];
                const Icon = meta.icon;
                return (
                  <li key={event.id} className="flex items-center gap-3 px-5 py-3">
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-lg"
                      style={{
                        backgroundColor: `color-mix(in oklab, ${meta.color} 14%, transparent)`,
                        color: meta.color,
                      }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{event.label}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{event.relationship}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{event.at}</span>
                  </li>
                );
              })}
              {(activity.data ?? []).length === 0 ? (
                <li className="px-5 py-6 text-center text-xs text-muted-foreground">
                  No graph activity found.
                </li>
              ) : null}
            </ul>
          )}
        </SectionCard>

        <div className="space-y-4 xl:col-span-1">

          <SectionCard title="Quick actions" icon={Zap}>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start text-left" onClick={() => setOpen(true)}>
                <Search className="size-4" /> Search the graph
              </Button>
              <Button asChild variant="outline" className="justify-start text-left">
                <Link to="/network">
                  <Network className="size-4" /> Explore relationships
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start text-left">
                <Link to="/insights">
                  <Sparkles className="size-4" /> Run graph insights
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start text-left">
                <Link to="/clients">
                  <Building2 className="size-4" /> Review client exposure
                </Link>
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Organization overview" icon={Users}>
            <div className="space-y-1">
              {(stats.data?.departments ?? []).map((d) => (
                <div key={d.name} className="space-y-1 py-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate text-muted-foreground">{d.name}</span>
                    <span className="font-mono tabular-nums">{d.count}</span>
                  </div>
                  <MiniBar value={(d.count / (stats.data?.employees ?? 1)) * 100 * 3} />
                </div>
              ))}
              <StatRow label="Clients engaged" value={stats.data?.clients ?? "—"} />
            </div>
          </SectionCard>

          <SectionCard
            title="Signals"
            description="Top findings from graph analytics"
            icon={Sparkles}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/insights">
                  All <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3">
              {(insights.data ?? []).slice(0, 4).map((card) => (
                <div key={card.id} className="rounded-lg border border-border/80 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-muted-foreground">{card.title}</p>
                    <span className="font-mono text-xs font-semibold">{card.metric}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium">{card.headline}</p>
                  <MiniBar value={card.score} />
                </div>
              ))}
              {insights.isLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
                : null}
            </div>
          </SectionCard>
        </div>
      </div>

    </div>
  );
}

function HighlightCard({
  icon: Icon,
  label,
  title,
  subtitle,
  metric,
  score,
  accent,
  to,
}: {
  icon: typeof Network;
  label: string;
  title: string;
  subtitle?: string | undefined;
  metric: string;
  score: number;
  accent: string;
  to?: { path: string; params?: Record<string, string> } | undefined;
}) {
  const body = (
    <div className="surface-panel hover-lift h-full p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <Icon className="size-3.5" style={{ color: accent }} />
          <span className="truncate">{label}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback
              className="text-xs font-semibold"
              style={{ backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}
            >
              {title
                .split(" ")
                .map((w) => w[0] ?? "")
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{title}</p>
            {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
      </div>
      <div>
        <p className="mt-3 font-mono text-xs text-muted-foreground">{metric}</p>
        <div className="mt-2">
          <MiniBar value={score} accent={accent} />
        </div>
      </div>
    </div>
  );

  if (!to) return body;

  let path = to.path;
  if (to.params) {
    Object.entries(to.params).forEach(([key, val]) => {
      path = path.replace(`$${key}`, val);
    });
  }

  return (
    <Link to={path} className="block h-full">
      {body}
    </Link>
  );
}
