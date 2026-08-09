import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader, CardGridSkeleton, EmptyState } from "@/components/common/page-primitives";
import { MiniBar } from "@/components/common/stat-card";
import { useSkills } from "@/data/hooks";



function SkillsPage() {
  const [query, setQuery] = useState("");
  const skills = useSkills(query);

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <PageHeader eyebrow="Graph entity" title="Skills" description="Capability nodes connect people to the work that needs them." />
      <div className="surface-panel relative p-4">
        <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills…" className="pl-9" />
      </div>
      {skills.isLoading ? (
        <CardGridSkeleton count={8} height={170} />
      ) : (skills.data ?? []).length === 0 ? (
        <EmptyState icon={Sparkles} title="No skills match" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(skills.data ?? []).map((s) => (
            <Link key={s.id} to={`/skills/${s.id}`} className="surface-panel hover-lift flex flex-col gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <Badge variant={s.rarity === "Critical" ? "destructive" : "secondary"} className="shrink-0 text-[10px]">
                  {s.rarity}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{s.category}</p>
              <div className="mt-auto space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{s.employeeIds.length} people</span>
                  <span>{s.projectIds.length} projects</span>
                </div>
                <MiniBar value={s.employeeIds.length * 6} accent="var(--entity-skill)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillsPage;
