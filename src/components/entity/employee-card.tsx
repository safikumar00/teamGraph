import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, MapPin, Network } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityChip } from "./entity-chip";
import type { Employee, Skill, Technology } from "@/data/types";

export function EmployeeCard({
  employee,
  skills,
  technologies,
  teamName,
}: {
  employee: Employee;
  skills: Skill[];
  technologies: Technology[];
  teamName?: string;
}) {
  return (
    <article className="surface-panel hover-lift flex flex-col gap-4 p-5">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <Avatar className="size-11 shrink-0">
          <AvatarFallback className="bg-entity-employee/12 text-sm font-semibold text-entity-employee">
            {employee.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <Link
            to={`/employees/${employee.id}`}
            className="block truncate text-sm font-semibold text-foreground hover:underline"
          >
            {employee.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{employee.role}</p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {employee.seniority}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Briefcase className="size-3" /> {employee.department}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3" /> {employee.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Network className="size-3" /> {employee.connections} links
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
          Primary skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((s) => (
            <EntityChip key={s.id} type="skill" label={s.name} to="/skills/$skillId" params={{ skillId: s.id }} />
          ))}
          {skills.length > 3 ? (
            <span className="text-xs text-muted-foreground">+{skills.length - 3}</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {technologies.slice(0, 3).map((t) => (
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

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <div className="min-w-0 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{employee.projectIds.length}</span> projects ·{" "}
          <span className="font-medium text-foreground">{employee.experienceYears}y</span> exp
          {teamName ? <span className="block truncate">{teamName}</span> : null}
        </div>
        <Button asChild size="sm" variant="outline" className="shrink-0">
          <Link to={`/employees/${employee.id}`}>
            Explore Network <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
