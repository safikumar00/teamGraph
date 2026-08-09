import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  recent: string[];
  pushRecent: (term: string) => void;
}

const Ctx = createContext<CommandPaletteContextValue | null>(null);
const RECENT_KEY = "teamgraph.recent-searches";

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) {
      try {
        setRecent(JSON.parse(raw) as string[]);
      } catch {
        /* ignore malformed cache */
      }
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<CommandPaletteContextValue>(
    () => ({
      open,
      setOpen,
      recent,
      pushRecent: (term: string) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        setRecent((prev) => {
          const next = [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, 6);
          localStorage.setItem(RECENT_KEY, JSON.stringify(next));
          return next;
        });
      },
    }),
    [open, recent],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCommandPalette() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  return ctx;
}
