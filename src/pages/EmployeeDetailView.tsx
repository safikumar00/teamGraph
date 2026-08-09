import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Award, Building2, GraduationCap, Network, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, SectionCard, EmptyState, StatRow } from "@/components/common/page-primitives";
import { EntityChip } from "@/components/entity/entity-chip";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { useCertifications, useEmployee, useGraph, useRelationships } from "@/data/hooks";
import { useDirectory } from "@/data/directory";
import { RELATIONSHIP_LABEL } from "@/components/entity/entity-meta";



function EmployeeDetail() {
  const { employeeId } = useParams();
  const { data: employee, isLoading } = useEmployee(employeeId);
  const dir = useDirectory();
  const certs = useCertifications();
  const relationships = useRelationships({ type: "employee", id: employeeId });
  const graph = useGraph({ limit: 16 });

  if (isLoading) return <Skeleton className="h-[70vh] w-full rounded-xl" />;
  if (!employee)
    return <EmptyState title="Employee not found" description="This node is no longer part of the graph." />;

  const manager = employee.managerId ? dir.employee(employee.managerId) : undefined;
  const team = dir.team(employee.teamId);
  const projects = employee.projectIds.map((id) => dir.project(id)).filter(Boolean);
  const clients = Array.from(new Set(projects.map((p) => p!.clientId))).map((id) => dir.client(id)).filter(Boolean);
  const collaborators = Array.from(
    new Set(projects.flatMap((p) => p!.memberIds).filter((id) => id !== employee.id)),
  )
    .slice(0, 8)
    .map((id) => dir.employee(id))
    .filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/employees">
          <ArrowLeft className="size-4" /> All employees
        </Link>
      </Button>

      <div className="surface-panel gradient-veil grid grid-cols-[minmax(0,1fr)] gap-5 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <Avatar className="size-16 shrink-0">
          <AvatarFallback className="bg-entity-employee/12 text-lg font-semibold text-entity-employee">
            {employee.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold">{employee.name}</h1>
          <p className="text-sm text-muted-foreground">{employee.role} · {employee.department}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {team ? <EntityChip type="team" label={team.name} to="/teams" /> : null}
            <Badge variant="secondary">{employee.seniority}</Badge>
            <Badge variant="outline">{employee.experienceYears} years</Badge>
            <Badge variant="outline">{employee.location}</Badge>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-3xl font-semibold">{employee.connections}</p>
          <p className="text-xs text-muted-foreground">graph relationships</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Profile" icon={Users}>
          <StatRow label="Email" value={<span className="truncate font-mono text-xs">{employee.email}</span>} />
          <StatRow label="Department" value={employee.department} />
          <StatRow label="Manager" value={manager ? manager.name : "None"} />
          <StatRow label="Joined" value={employee.joinedAt} />
          <StatRow label="Projects" value={projects.length} />
        </SectionCard>

        <SectionCard title="Skills" icon={GraduationCap}>
          <div className="flex flex-wrap gap-1.5">
            {employee.skillIds.map((id) => {
              const s = dir.skill(id);
              return s ? <EntityChip key={id} type="skill" label={s.name} to={`/skills/${s.id}`} /> : null;
            })}
          </div>
        </SectionCard>

        <SectionCard title="Technologies" icon={Network}>
          <div className="flex flex-wrap gap-1.5">
            {employee.technologyIds.map((id) => {
              const t = dir.technology(id);
              return t ? (
                <EntityChip key={id} type="technology" label={t.name} to={`/technologies/${t.id}`} />
              ) : null;
            })}
          </div>
        </SectionCard>

        <SectionCard title="Projects" icon={Network} className="xl:col-span-2" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {projects.map((p) => (
              <li key={p!.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3">
                <Link to={`/projects/${p!.id}`} className="min-w-0">
                  <p className="truncate text-sm font-medium hover:underline">{p!.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{p!.code} · {p!.status}</p>
                </Link>
                <Badge variant="secondary" className="shrink-0">{p!.progress}%</Badge>
              </li>
            ))}
            {projects.length === 0 ? <li className="p-5"><EmptyState title="No project edges yet" /></li> : null}
          </ul>
        </SectionCard>

        <SectionCard title="Clients" icon={Building2}>
          <div className="flex flex-wrap gap-1.5">
            {clients.map((c) => (
              <EntityChip key={c!.id} type="client" label={c!.name} to={`/clients/${c!.id}`} />
            ))}
            {clients.length === 0 ? <p className="text-sm text-muted-foreground">No client exposure.</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="Certifications" icon={Award}>
          <div className="flex flex-wrap gap-1.5">
            {employee.certificationIds.map((id) => {
              const c = certs.data?.find((x) => x.id === id);
              return c ? <EntityChip key={id} type="certification" label={`${c.name} · ${c.issuer}`} /> : null;
            })}
            {employee.certificationIds.length === 0 ? (
              <p className="text-sm text-muted-foreground">No certifications recorded.</p>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="Mentorship" icon={GraduationCap}>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Mentors</p>
          <div className="flex flex-wrap gap-1.5">
            {employee.mentorIds.map((id) => {
              const m = dir.employee(id);
              return m ? <EntityChip key={id} type="employee" label={m.name} to={`/employees/${id}`} /> : null;
            })}
            {employee.mentorIds.length === 0 ? <p className="text-sm text-muted-foreground">None</p> : null}
          </div>
          <p className="mt-4 mb-2 text-xs font-medium text-muted-foreground">Mentees</p>
          <div className="flex flex-wrap gap-1.5">
            {employee.menteeIds.map((id) => {
              const m = dir.employee(id);
              return m ? <EntityChip key={id} type="employee" label={m.name} to={`/employees/${id}`} muted /> : null;
            })}
            {employee.menteeIds.length === 0 ? <p className="text-sm text-muted-foreground">None</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="Recent collaborators" icon={Users}>
          <div className="flex flex-wrap gap-1.5">
            {collaborators.map((c) => (
              <EntityChip key={c!.id} type="employee" label={c!.name} to={`/employees/${c!.id}`} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Relationship timeline" icon={Network} className="xl:col-span-2" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {(relationships.data ?? []).slice(0, 10).map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                <span className="font-mono text-[11px] text-muted-foreground">{r.type}</span>
                <span className="truncate text-muted-foreground">
                  {employee.name} {RELATIONSHIP_LABEL[r.type]} {dir.labelFor(r.to.type, r.to.id)}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Connected network" description="Preview of the surrounding graph" icon={Network} bodyClassName="h-64 p-2">
          {graph.data ? <GraphCanvas snapshot={graph.data} /> : <Skeleton className="h-full w-full" />}
        </SectionCard>
      </div>
    </div>
  );
}

export default EmployeeDetail;
