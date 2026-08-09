import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, CardGridSkeleton, EmptyState, ErrorState } from "@/components/common/page-primitives";
import { EmployeeCard } from "@/components/entity/employee-card";
import { useEmployees } from "@/data/hooks";
import { useDirectory } from "@/data/directory";



const ALL = "all";

function EmployeesPage() {
  const dir = useDirectory();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [teamId, setTeamId] = useState(ALL);
  const [skillId, setSkillId] = useState(ALL);
  const [technologyId, setTechnologyId] = useState(ALL);

  const employees = useEmployees({
    query,
    ...(department !== ALL ? { department } : {}),
    ...(teamId !== ALL ? { teamId } : {}),
    ...(skillId !== ALL ? { skillId } : {}),
    ...(technologyId !== ALL ? { technologyId } : {}),
  });

  const departments = Array.from(new Set(dir.employees.map((e) => e.department)));

  if (employees.isError) return <ErrorState onRetry={() => employees.refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <PageHeader
        eyebrow="Graph entity"
        title="Employees"
        description="Every person is a node. Filter by relationship, not by spreadsheet column."
      />

      <div className="surface-panel grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="relative xl:col-span-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people…" className="pl-9" />
        </div>
        <FilterSelect value={department} onChange={setDepartment} placeholder="Department" options={departments.map((d) => ({ value: d, label: d }))} />
        <FilterSelect value={teamId} onChange={setTeamId} placeholder="Team" options={dir.teams.map((t) => ({ value: t.id, label: t.name }))} />
        <FilterSelect value={skillId} onChange={setSkillId} placeholder="Skill" options={dir.skills.map((s) => ({ value: s.id, label: s.name }))} />
        <FilterSelect value={technologyId} onChange={setTechnologyId} placeholder="Technology" options={dir.technologies.map((t) => ({ value: t.id, label: t.name }))} />
      </div>

      {employees.isLoading ? (
        <CardGridSkeleton count={6} height={280} />
      ) : (employees.data ?? []).length === 0 ? (
        <EmptyState icon={Users} title="No people match these relationships" description="Loosen a filter to widen the traversal." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(employees.data ?? []).map((e) => (
            <EmployeeCard
              key={e.id}
              employee={e}
              skills={e.skillIds.map((id) => dir.skill(id)).filter(Boolean) as never}
              technologies={e.technologyIds.map((id) => dir.technology(id)).filter(Boolean) as never}
              {...(dir.team(e.teamId)?.name ? { teamName: dir.team(e.teamId)!.name } : {})}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value="all">All {placeholder.toLowerCase()}s</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default EmployeesPage;
