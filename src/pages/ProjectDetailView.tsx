import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Building2, CalendarRange, GitBranch, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, SectionCard, EmptyState, StatRow } from "@/components/common/page-primitives";
import { EntityChip } from "@/components/entity/entity-chip";
import { RiskPill, StatusBadge } from "@/components/entity/project-card";
import { useProject } from "@/data/hooks";
import { useDirectory } from "@/data/directory";



function ProjectDetail() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId);
  const dir = useDirectory();

  if (isLoading) return <Skeleton className="h-[70vh] w-full rounded-xl" />;
  if (!project) return <EmptyState title="Project not found" />;

  const client = dir.client(project.clientId);
  const team = dir.team(project.teamId);

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/projects"><ArrowLeft className="size-4" /> All projects</Link>
      </Button>

      <PageHeader
        eyebrow={project.code}
        title={project.name}
        description={project.summary}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />
            <RiskPill risk={project.risk} />
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Overview" icon={CalendarRange}>
          <div className="mb-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono tabular-nums">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          <StatRow label="Started" value={project.startedAt} />
          <StatRow label="Target" value={project.targetAt} />
          <StatRow label="Team size" value={project.memberIds.length} />
          <StatRow label="Dependencies" value={project.dependsOn.length} />
        </SectionCard>

        <SectionCard title="Client" icon={Building2}>
          {client ? (
            <div className="space-y-2">
              <EntityChip type="client" label={client.name} to={`/clients/${client.id}`} />
              <StatRow label="Industry" value={client.industry} />
              <StatRow label="Region" value={client.region} />
              <StatRow label="Health" value={client.health} />
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Owning team" icon={Users}>
          {team ? (
            <div className="space-y-2">
              <EntityChip type="team" label={team.name} to="/teams" />
              <p className="text-sm text-muted-foreground">{team.focus}</p>
              <StatRow label="Members" value={team.memberIds.length} />
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Connected employees" icon={Users} className="xl:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {project.memberIds.map((id) => {
              const e = dir.employee(id);
              return e ? <EntityChip key={id} type="employee" label={e.name} to={`/employees/${id}`} /> : null;
            })}
          </div>
        </SectionCard>

        <SectionCard title="Connected skills" icon={Sparkles}>
          <div className="flex flex-wrap gap-1.5">
            {project.skillIds.map((id) => {
              const s = dir.skill(id);
              return s ? <EntityChip key={id} type="skill" label={s.name} to={`/skills/${id}`} /> : null;
            })}
          </div>
        </SectionCard>

        <SectionCard title="Technologies" icon={Sparkles} className="xl:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {project.technologyIds.map((id) => {
              const t = dir.technology(id);
              return t ? <EntityChip key={id} type="technology" label={t.name} to={`/technologies/${id}`} /> : null;
            })}
          </div>
        </SectionCard>

        <SectionCard title="Dependencies" icon={GitBranch}>
          <div className="space-y-2">
            {project.dependsOn.map((id) => {
              const p = dir.project(id);
              return p ? (
                <Link key={id} to={`/projects/${id}`} className="flex items-center justify-between gap-3 rounded-lg border border-border/80 px-3 py-2 hover:bg-muted/60">
                  <span className="truncate text-sm">{p.name}</span>
                  <Badge variant="secondary" className="shrink-0">{p.status}</Badge>
                </Link>
              ) : null;
            })}
            {project.dependsOn.length === 0 ? <p className="text-sm text-muted-foreground">No upstream dependencies.</p> : null}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default ProjectDetail;
