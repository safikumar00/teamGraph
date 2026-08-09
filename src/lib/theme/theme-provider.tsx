import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_THEME, THEMES, type ColorMode } from "./themes";

interface ThemeContextValue {
  theme: string;
  mode: ColorMode;
  resolvedMode: "light" | "dark";
  setTheme: (id: string) => void;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  themes: typeof THEMES;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "teamgraph.theme";
const MODE_KEY = "teamgraph.mode";

function systemMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string>(DEFAULT_THEME);
  const [mode, setModeState] = useState<ColorMode>("system");
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  // Hydration-safe: read persisted preferences after mount only.
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    const storedMode = localStorage.getItem(MODE_KEY) as ColorMode | null;
    if (storedTheme && THEMES.some((t) => t.id === storedTheme)) setThemeState(storedTheme);
    if (storedMode) setModeState(storedMode);
  }, []);

  useEffect(() => {
    const apply = () => {
      const next = mode === "system" ? systemMode() : mode;
      setResolvedMode(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.dataset["theme"] = theme;
      document.documentElement.style.colorScheme = next;
    };
    apply();
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme, mode]);

  const setTheme = useCallback((id: string) => {
    setThemeState(id);
    localStorage.setItem(THEME_KEY, id);
  }, []);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    localStorage.setItem(MODE_KEY, next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      resolvedMode,
      setTheme,
      setMode,
      toggleMode: () => setMode(resolvedMode === "dark" ? "light" : "dark"),
      themes: THEMES,
    }),
    [theme, mode, resolvedMode, setTheme, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
