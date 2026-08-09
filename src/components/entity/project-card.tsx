import { Link } from "react-router-dom";
import { AlertTriangle, GitBranch, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { EntityChip } from "./entity-chip";
import type { Project, ProjectStatus, RiskLevel, Technology } from "@/data/types";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const tone: Record<ProjectStatus, string> = {
    Active: "bg-success/12 text-success border-success/25",
    Planning: "bg-entity-skill/12 text-entity-skill border-entity-skill/25",
    "At Risk": "bg-destructive/12 text-destructive border-destructive/25",
    Completed: "bg-muted text-muted-foreground border-border",
    "On Hold": "bg-warning/12 text-warning border-warning/25",
  };
  return (
    <Badge variant="outline" className={cn("shrink-0 text-[10px]", tone[status])}>
      {status}
    </Badge>
  );
}

export function RiskPill({ risk }: { risk: RiskLevel }) {
  const tone: Record<RiskLevel, string> = {
    Low: "text-success",
    Medium: "text-warning",
    High: "text-destructive",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", tone[risk])}>
      <AlertTriangle className="size-3" /> {risk} risk
    </span>
  );
}

export function ProjectCard({
  project,
  clientName,
  teamName,
  technologies,
}: {
  project: Project;
  clientName?: string;
  teamName?: string;
  technologies: Technology[];
}) {
  return (
    <article className="surface-panel hover-lift flex flex-col gap-4 p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <Link
            to={`/projects/${project.id}`}
            className="block truncate text-sm font-semibold text-foreground hover:underline"
          >
            {project.name}
          </Link>
          <p className="font-mono text-[11px] text-muted-foreground">{project.code}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <p className="line-clamp-2 text-xs text-muted-foreground">{project.summary}</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono font-medium tabular-nums">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {clientName ? (
          <EntityChip type="client" label={clientName} to="/clients/$clientId" params={{ clientId: project.clientId }} />
        ) : null}
        {teamName ? <EntityChip type="team" label={teamName} to="/teams" /> : null}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {technologies.slice(0, 4).map((t) => (
          <EntityChip
            key={t.id}
            type="technology"
            label={t.name}
            to="/technologies/$technologyId"
            params={{ technologyId: t.id }}
            muted
          />
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="size-3" /> {project.memberIds.length} people
        </span>
        <span className="inline-flex items-center gap-1">
          <GitBranch className="size-3" /> {project.dependsOn.length} dependencies
        </span>
        <RiskPill risk={project.risk} />
      </div>
    </article>
  );
}
