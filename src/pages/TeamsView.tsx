import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Boxes, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader, CardGridSkeleton, EmptyState } from "@/components/common/page-primitives";
import { EntityChip } from "@/components/entity/entity-chip";
import { useTeams } from "@/data/hooks";
import { useDirectory } from "@/data/directory";



function TeamsPage() {
  const teams = useTeams();
  const dir = useDirectory();

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <PageHeader eyebrow="Graph entity" title="Teams" description="Teams are clusters. Their value shows in the edges between them." />
      {teams.isLoading ? (
        <CardGridSkeleton count={6} height={300} />
      ) : (teams.data ?? []).length === 0 ? (
        <EmptyState icon={Boxes} title="No teams found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(teams.data ?? []).map((team) => {
            const lead = dir.employee(team.leadId);
            return (
              <article key={team.id} className="surface-panel hover-lift flex flex-col gap-4 p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{team.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{team.department}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <Users className="mr-1 size-3" /> {team.memberIds.length}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{team.focus}</p>

                {lead ? (
                  <div>
                    <p className="mb-1.5 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">Lead</p>
                    <EntityChip type="employee" label={lead.name} to={`/employees/${lead.id}`} />
                  </div>
                ) : null}

                <div>
                  <p className="mb-1.5 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">Projects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {team.projectIds.slice(0, 3).map((id) => {
                      const p = dir.project(id);
                      return p ? <EntityChip key={id} type="project" label={p.name} to={`/projects/${id}`} /> : null;
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">Skills & technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {team.skillIds.slice(0, 3).map((id) => {
                      const s = dir.skill(id);
                      return s ? <EntityChip key={id} type="skill" label={s.name} to={`/skills/${id}`} muted /> : null;
                    })}
                    {team.technologyIds.slice(0, 3).map((id) => {
                      const t = dir.technology(id);
                      return t ? <EntityChip key={id} type="technology" label={t.name} to={`/technologies/${id}`} muted /> : null;
                    })}
                  </div>
                </div>

                <div className="mt-auto border-t border-border/70 pt-4">
                  <p className="mb-1.5 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    Cross-team collaboration
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {team.collaboratesWith.slice(0, 4).map((id) => {
                      const t = dir.team(id);
                      return t ? <EntityChip key={id} type="team" label={t.name} /> : null;
                    })}
                    {team.collaboratesWith.length === 0 ? (
                      <span className="text-xs text-muted-foreground">Isolated cluster</span>
                    ) : null}
                  </div>
                </div>

                <Link to="/network" className="text-xs font-medium text-primary hover:underline">
                  View in Network Explorer →
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TeamsPage;
