import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader, CardGridSkeleton, EmptyState } from "@/components/common/page-primitives";
import { useClients } from "@/data/hooks";



function ClientsPage() {
  const [query, setQuery] = useState("");
  const clients = useClients(query);

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <PageHeader eyebrow="Graph entity" title="Clients" description="Accounts seen through the work and people connected to them." />
      <div className="surface-panel relative p-4">
        <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clients…" className="pl-9" />
      </div>
      {clients.isLoading ? (
        <CardGridSkeleton count={6} height={190} />
      ) : (clients.data ?? []).length === 0 ? (
        <EmptyState icon={Building2} title="No clients match" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(clients.data ?? []).map((c) => (
            <Link key={c.id} to={`/clients/${c.id}`} className="surface-panel hover-lift flex flex-col gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.industry} · {c.region}</p>
                </div>
                <Badge variant={c.health === "Escalated" ? "destructive" : "secondary"} className="shrink-0 text-[10px]">
                  {c.health}
                </Badge>
              </div>
              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border/70 pt-3 text-center">
                <Metric label="Projects" value={c.projectIds.length} />
                <Metric label="Teams" value={c.teamIds.length} />
                <Metric label="Tech" value={c.technologyIds.length} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-mono text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

export default ClientsPage;
