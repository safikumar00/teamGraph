import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Clock, CornerDownLeft, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "@/data/hooks";
import { ENTITY_META } from "@/components/entity/entity-meta";
import { useCommandPalette } from "./command-palette-context";
import type { EntityType, SearchResult } from "@/data/types";

const ORDER: EntityType[] = ["employee", "project", "team", "skill", "technology", "client"];

const DETAIL_ROUTE: Partial<Record<EntityType, string>> = {
  employee: "/employees/$employeeId",
  project: "/projects/$projectId",
  skill: "/skills/$skillId",
  technology: "/technologies/$technologyId",
  client: "/clients/$clientId",
  team: "/teams",
};

const PARAM_KEY: Partial<Record<EntityType, string>> = {
  employee: "employeeId",
  project: "projectId",
  skill: "skillId",
  technology: "technologyId",
  client: "clientId",
};

export function CommandPalette() {
  const { open, setOpen, recent, pushRecent } = useCommandPalette();
  const [query, setQuery] = useState("");
  const { data, isFetching } = useSearch(query);
  const navigate = useNavigate();

  const grouped = ORDER.map((type) => ({
    type,
    items: (data ?? []).filter((r) => r.type === type).slice(0, 5),
  })).filter((g) => g.items.length > 0);

  const go = (result: SearchResult) => {
    pushRecent(result.title);
    setOpen(false);
    setQuery("");
    const route = DETAIL_ROUTE[result.type];
    const paramKey = PARAM_KEY[result.type];
    if (!route) return;
    const path = paramKey
      ? route.replace(`$${paramKey}`, result.id)
      : route;
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search employees, projects, skills, technologies…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="scroll-slim max-h-[62vh]">
        <CommandEmpty>
          {isFetching ? "Traversing the graph…" : "No matching nodes in the organization graph."}
        </CommandEmpty>

        {!query && recent.length > 0 ? (
          <>
            <CommandGroup heading="Recent searches">
              {recent.map((term) => (
                <CommandItem key={term} value={`recent-${term}`} onSelect={() => setQuery(term)}>
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="truncate">{term}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        ) : null}

        {grouped.map((group) => {
          const meta = ENTITY_META[group.type];
          const Icon = meta.icon;
          return (
            <CommandGroup key={group.type} heading={meta.plural}>
              {group.items.map((item) => (
                <CommandItem key={item.id} value={`${item.type}-${item.title}`} onSelect={() => go(item)}>
                  <Icon className="size-4" style={{ color: meta.color }} />
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  <span className="truncate text-xs text-muted-foreground">{item.subtitle}</span>
                  <CornerDownLeft className="size-3 text-muted-foreground opacity-0 group-data-[selected=true]:opacity-100" />
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Search className="size-3" /> Graph-wide search
        </span>
        <span className="hidden gap-3 sm:flex">
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">↑↓</kbd> navigate
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">↵</kbd> open
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">esc</kbd> close
        </span>
      </div>
    </CommandDialog>
  );
}
