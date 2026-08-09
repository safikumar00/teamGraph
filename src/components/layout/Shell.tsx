import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { CommandPaletteProvider } from "@/components/search/command-palette-context";
import { CommandPalette } from "@/components/search/command-palette";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Toaster } from "@/components/ui/sonner";

export default function AppShell() {
  return (
    <ThemeProvider>
      <CommandPaletteProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background text-foreground">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Topbar />
              <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                <Outlet />
              </main>
            </div>
          </div>
          <CommandPalette />
          <Toaster />
        </SidebarProvider>
      </CommandPaletteProvider>
    </ThemeProvider>
  );
}
