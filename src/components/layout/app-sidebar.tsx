import { Link, useLocation } from "react-router-dom";
import {
  Boxes,
  Building2,
  Cpu,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  Network,
  Settings,
  Sparkles,
  Users,
  Waypoints,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const EXPLORE = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Network Explorer", url: "/network", icon: Network },
];

const ENTITIES = [
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Teams", url: "/teams", icon: Boxes },
  { title: "Skills", url: "/skills", icon: Sparkles },
  { title: "Technologies", url: "/technologies", icon: Cpu },
  { title: "Clients", url: "/clients", icon: Building2 },
];

const SYSTEM = [
  { title: "Insights", url: "/insights", icon: Lightbulb },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  const renderGroup = (label: string, items: typeof EXPLORE) => (
    <SidebarGroup>
      {!collapsed ? (
        <SidebarGroupLabel className="text-[10px] tracking-[0.14em] uppercase">{label}</SidebarGroupLabel>
      ) : null}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2.5">
                  <item.icon className="size-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/70 px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Waypoints className="size-4" />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-sidebar-foreground">TeamGraph</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                Relationship Intelligence
              </span>
            </span>
          ) : null}
        </Link>
      </SidebarHeader>

      <SidebarContent className="scroll-slim">
        {renderGroup("Explore", EXPLORE)}
        {renderGroup("Graph Entities", ENTITIES)}
        {renderGroup("Organization", SYSTEM)}
      </SidebarContent>

      {!collapsed ? (
        <SidebarFooter className="border-t border-sidebar-border/70 p-3">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/60 p-3">
            <p className="text-xs font-medium text-sidebar-accent-foreground">Graph engine</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Connected to CognoDB live graph.
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Live mode
            </span>
          </div>
        </SidebarFooter>
      ) : null}
    </Sidebar>
  );
}
