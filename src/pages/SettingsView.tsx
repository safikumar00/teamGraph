import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Check, Monitor, Moon, Palette, Sun, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, SectionCard } from "@/components/common/page-primitives";
import { useTheme } from "@/lib/theme/theme-provider";
import { cn } from "@/lib/utils";



function SettingsPage() {
  const { theme, setTheme, themes, mode, setMode } = useTheme();

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-6">
      <PageHeader eyebrow="Workspace" title="Settings" description="Preferences for this workspace and how TeamGraph looks." />

      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <SectionCard title="Organization" description="Workspace-wide defaults">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Organization name" defaultValue="Northwind Group" />
              <Field label="Primary region" defaultValue="EMEA" />
              <Field label="Graph engine" defaultValue="CognoDB (pending)" disabled />
              <Field label="Data refresh" defaultValue="Every 15 minutes" />
            </div>
            <Button className="mt-4" onClick={() => toast.success("Workspace settings saved")}>Save changes</Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <SectionCard title="Your profile" icon={User}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" defaultValue="Avery Nolan" />
              <Field label="Role" defaultValue="Org Intelligence Admin" />
              <Field label="Email" defaultValue="avery.nolan@teamgraph.io" />
              <Field label="Location" defaultValue="Amsterdam" />
            </div>
            <Button className="mt-4" onClick={() => toast.success("Profile updated")}>Update profile</Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <SectionCard title="Notifications" description="What the graph should tell you about">
            <div className="divide-y divide-border">
              {[
                ["New relationship alerts", "When new edges appear between people and projects", true],
                ["Risk escalations", "Projects moving to At Risk or High risk", true],
                ["Rare skill changes", "When a rare capability gains or loses a holder", false],
                ["Weekly digest", "A Monday summary of graph movement", true],
              ].map(([title, description, on]) => (
                <div key={title as string} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{title as string}</p>
                    <p className="text-xs text-muted-foreground">{description as string}</p>
                  </div>
                  <Switch defaultChecked={on as boolean} />
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4 space-y-4">
          <SectionCard title="Brand theme" description="White-label palettes, switched instantly and persisted" icon={Palette}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "hover-lift rounded-xl border p-4 text-left transition-colors",
                    theme === t.id ? "border-primary ring-1 ring-primary" : "border-border",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex gap-1">
                      {t.swatch.map((c) => (
                        <span key={c} className="size-5 rounded-full border border-border" style={{ backgroundColor: c }} />
                      ))}
                    </span>
                    {theme === t.id ? <Check className="size-4 text-primary" /> : null}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Color mode" description="Light, dark or follow the system">
            <div className="flex flex-wrap gap-2">
              {([
                ["light", "Light", Sun],
                ["dark", "Dark", Moon],
                ["system", "System", Monitor],
              ] as const).map(([value, label, Icon]) => (
                <Button
                  key={value}
                  variant={mode === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode(value)}
                >
                  <Icon className="size-4" /> {label}
                </Button>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, defaultValue, disabled }: { label: string; defaultValue: string; disabled?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} disabled={disabled} />
    </div>
  );
}

export default SettingsPage;
