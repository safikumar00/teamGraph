import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Cpu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader, CardGridSkeleton, EmptyState } from "@/components/common/page-primitives";
import { MiniBar } from "@/components/common/stat-card";
import { useTechnologies } from "@/data/hooks";



function TechnologiesPage() {
  const [query, setQuery] = useState("");
  const technologies = useTechnologies(query);

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <PageHeader eyebrow="Graph entity" title="Technologies" description="Adoption is a relationship count, not a survey answer." />
      <div className="surface-panel relative p-4">
        <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search technologies…" className="pl-9" />
      </div>
      {technologies.isLoading ? (
        <CardGridSkeleton count={8} height={170} />
      ) : (technologies.data ?? []).length === 0 ? (
        <EmptyState icon={Cpu} title="No technologies match" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(technologies.data ?? []).map((t) => (
            <Link key={t.id} to={`/technologies/${t.id}`} className="surface-panel hover-lift flex flex-col gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate text-sm font-semibold">{t.name}</p>
                <Badge variant="secondary" className="shrink-0 text-[10px]">{t.category}</Badge>
              </div>
              <div className="mt-auto space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t.projectIds.length} projects</span>
                  <span className="font-mono">{t.adoption}%</span>
                </div>
                <MiniBar value={t.adoption} accent="var(--entity-technology)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnologiesPage;
