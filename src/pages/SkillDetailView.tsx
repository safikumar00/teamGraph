import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Cpu, FolderKanban, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, SectionCard, EmptyState } from "@/components/common/page-primitives";
import { EntityChip } from "@/components/entity/entity-chip";
import { useSkill } from "@/data/hooks";
import { useDirectory } from "@/data/directory";



function SkillDetail() {
  const { skillId } = useParams();
  const { data: skill, isLoading } = useSkill(skillId);
  const dir = useDirectory();

  if (isLoading) return <Skeleton className="h-[60vh] w-full rounded-xl" />;
  if (!skill) return <EmptyState title="Skill not found" />;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/skills"><ArrowLeft className="size-4" /> All skills</Link>
      </Button>
      <PageHeader
        eyebrow={skill.category}
        title={skill.name}
        description={`${skill.employeeIds.length} people hold this capability across ${skill.projectIds.length} projects.`}
        actions={<Badge variant={skill.rarity === "Critical" ? "destructive" : "secondary"}>{skill.rarity}</Badge>}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Employees with this skill" icon={Users} className="xl:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {skill.employeeIds.map((id) => {
              const e = dir.employee(id);
              return e ? <EntityChip key={id} type="employee" label={e.name} to={`/employees/${id}`} /> : null;
            })}
          </div>
        </SectionCard>
        <SectionCard title="Related technologies" icon={Cpu}>
          <div className="flex flex-wrap gap-1.5">
            {skill.technologyIds.map((id) => {
              const t = dir.technology(id);
              return t ? <EntityChip key={id} type="technology" label={t.name} to={`/technologies/${id}`} /> : null;
            })}
          </div>
        </SectionCard>
        <SectionCard title="Projects requiring this skill" icon={FolderKanban} className="xl:col-span-3">
          <div className="flex flex-wrap gap-1.5">
            {skill.projectIds.map((id) => {
              const p = dir.project(id);
              return p ? <EntityChip key={id} type="project" label={p.name} to={`/projects/${id}`} /> : null;
            })}
            {skill.projectIds.length === 0 ? <p className="text-sm text-muted-foreground">Not yet applied to delivery.</p> : null}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default SkillDetail;
