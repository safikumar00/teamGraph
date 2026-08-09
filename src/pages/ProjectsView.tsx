import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FolderKanban, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, CardGridSkeleton, EmptyState, ErrorState } from "@/components/common/page-primitives";
import { ProjectCard } from "@/components/entity/project-card";
import { useProjects } from "@/data/hooks";
import { useDirectory } from "@/data/directory";



function ProjectsPage() {
  const dir = useDirectory();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [clientId, setClientId] = useState("all");
  const projects = useProjects({ query, status, ...(clientId !== "all" ? { clientId } : {}) });

  if (projects.isError) return <ErrorState onRetry={() => projects.refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <PageHeader eyebrow="Graph entity" title="Projects" description="Each project connects a client, a team, technologies and people." />

      <div className="surface-panel grid gap-3 p-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {["All", "Active", "Planning", "At Risk", "Completed", "On Hold"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">All clients</SelectItem>
            {dir.clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {projects.isLoading ? (
        <CardGridSkeleton count={6} height={300} />
      ) : (projects.data ?? []).length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects in this slice of the graph" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(projects.data ?? []).map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              {...(dir.client(p.clientId)?.name ? { clientName: dir.client(p.clientId)!.name } : {})}
              {...(dir.team(p.teamId)?.name ? { teamName: dir.team(p.teamId)!.name } : {})}
              technologies={p.technologyIds.map((id) => dir.technology(id)).filter(Boolean) as never}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
