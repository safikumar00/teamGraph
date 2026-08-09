import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, FolderKanban, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, SectionCard, EmptyState } from "@/components/common/page-primitives";
import { EntityChip } from "@/components/entity/entity-chip";
import { useTechnology } from "@/data/hooks";
import { useDirectory } from "@/data/directory";



function TechnologyDetail() {
  const { technologyId } = useParams();
  const { data: tech, isLoading } = useTechnology(technologyId);
  const dir = useDirectory();

  if (isLoading) return <Skeleton className="h-[60vh] w-full rounded-xl" />;
  if (!tech) return <EmptyState title="Technology not found" />;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/technologies"><ArrowLeft className="size-4" /> All technologies</Link>
      </Button>
      <PageHeader
        eyebrow={tech.category}
        title={tech.name}
        description={`Used on ${tech.projectIds.length} projects by ${tech.employeeIds.length} people.`}
        actions={<Badge variant="secondary">{tech.adoption}% adoption</Badge>}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Projects" icon={FolderKanban} className="xl:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {tech.projectIds.map((id) => {
              const p = dir.project(id);
              return p ? <EntityChip key={id} type="project" label={p.name} to={`/projects/${id}`} /> : null;
            })}
          </div>
        </SectionCard>
        <SectionCard title="Related skills" icon={Sparkles}>
          <div className="flex flex-wrap gap-1.5">
            {tech.skillIds.map((id) => {
              const s = dir.skill(id);
              return s ? <EntityChip key={id} type="skill" label={s.name} to={`/skills/${id}`} /> : null;
            })}
          </div>
        </SectionCard>
        <SectionCard title="Employees" icon={Users} className="xl:col-span-3">
          <div className="flex flex-wrap gap-1.5">
            {tech.employeeIds.map((id) => {
              const e = dir.employee(id);
              return e ? <EntityChip key={id} type="employee" label={e.name} to={`/employees/${id}`} /> : null;
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default TechnologyDetail;
