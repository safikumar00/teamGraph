import { Link } from "react-router-dom";
import { Bell, Check, LogOut, Moon, Palette, Search, Settings, Sun, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/lib/theme/theme-provider";
import { useCommandPalette } from "@/components/search/command-palette-context";
import { useActivity } from "@/data/hooks";
import { useAuth } from "@/lib/AuthContext";

export function Topbar() {
  const { setOpen } = useCommandPalette();
  const { theme, setTheme, themes, resolvedMode, setMode } = useTheme();
  const { data: activity } = useActivity();
  const { user, logout } = useAuth();
  
  const notifications = (activity ?? []).slice(0, 5);

  const userName = user?.name || user?.email || "Admin User";
  const userRole = user?.role || "Org Intelligence Admin";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-5">
        <SidebarTrigger className="shrink-0" />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted md:w-[26rem]"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate">Search the organization graph…</span>
          <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] md:inline">
            ⌘K
          </kbd>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Switch theme">
                <Palette className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>Brand theme</DropdownMenuLabel>
              {themes.map((t) => (
                <DropdownMenuItem key={t.id} onSelect={() => setTheme(t.id)} className="gap-2">
                  <span className="flex shrink-0 gap-0.5">
                    {t.swatch.map((c) => (
                      <span
                         key={c}
                         className="size-3 rounded-full border border-border"
                         style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{t.name}</span>
                  {theme === t.id ? <Check className="size-3.5" /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}
          >
            {resolvedMode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Graph activity</p>
                <Badge variant="secondary">{notifications.length} new</Badge>
              </div>
              <ul className="max-h-80 divide-y divide-border overflow-auto">
                {notifications.map((n) => (
                  <li key={n.id} className="px-4 py-3">
                    <p className="text-sm text-foreground">{n.label}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {n.relationship} · {n.at}
                    </p>
                  </li>
                ))}
                {notifications.length === 0 ? (
                  <li className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No recent activity.
                  </li>
                ) : null}
              </ul>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{userRole}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full flex items-center gap-2">
                  <User className="size-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full flex items-center gap-2">
                  <Settings className="size-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500 cursor-pointer">
                <LogOut className="size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
