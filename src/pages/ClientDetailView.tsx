import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Boxes, Cpu, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, SectionCard, EmptyState, StatRow } from "@/components/common/page-primitives";
import { EntityChip } from "@/components/entity/entity-chip";
import { useClient } from "@/data/hooks";
import { useDirectory } from "@/data/directory";



function ClientDetail() {
  const { clientId } = useParams();
  const { data: client, isLoading } = useClient(clientId);
  const dir = useDirectory();

  if (isLoading) return <Skeleton className="h-[60vh] w-full rounded-xl" />;
  if (!client) return <EmptyState title="Client not found" />;

  const people = Array.from(
    new Set(client.projectIds.flatMap((id) => dir.project(id)?.memberIds ?? [])),
  ).slice(0, 16);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/clients"><ArrowLeft className="size-4" /> All clients</Link>
      </Button>
      <PageHeader
        eyebrow={client.industry}
        title={client.name}
        description={`Partner since ${client.since} · ${client.region}`}
        actions={<Badge variant={client.health === "Escalated" ? "destructive" : "secondary"}>{client.health}</Badge>}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Relationship overview" icon={FolderKanban}>
          <StatRow label="Projects" value={client.projectIds.length} />
          <StatRow label="Delivery teams" value={client.teamIds.length} />
          <StatRow label="Technologies" value={client.technologyIds.length} />
          <StatRow label="People engaged" value={people.length} />
        </SectionCard>
        <SectionCard title="Projects" icon={FolderKanban} className="xl:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {client.projectIds.map((id) => {
              const p = dir.project(id);
              return p ? <EntityChip key={id} type="project" label={p.name} to={`/projects/${id}`} /> : null;
            })}
          </div>
        </SectionCard>
        <SectionCard title="Teams" icon={Boxes}>
          <div className="flex flex-wrap gap-1.5">
            {client.teamIds.map((id) => {
              const t = dir.team(id);
              return t ? <EntityChip key={id} type="team" label={t.name} to="/teams" /> : null;
            })}
          </div>
        </SectionCard>
        <SectionCard title="Technologies" icon={Cpu} className="xl:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {client.technologyIds.map((id) => {
              const t = dir.technology(id);
              return t ? <EntityChip key={id} type="technology" label={t.name} to={`/technologies/${id}`} muted /> : null;
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default ClientDetail;
