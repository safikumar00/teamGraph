/**
 * White-label theme registry.
 *
 * Adding a theme = append its CSS variable block to `src/themes.css`
 * (light + dark) and register a descriptor here. Nothing else changes.
 */
export interface ThemeDescriptor {
  id: string;
  name: string;
  description: string;
  /** Preview swatches, in order: primary, accent, surface. */
  swatch: [string, string, string];
}

export const THEMES: ThemeDescriptor[] = [
  {
    id: "vercel",
    name: "Vercel",
    description: "High-contrast monochrome with geometric type",
    swatch: ["oklch(0 0 0)", "oklch(0.94 0 0)", "oklch(0.99 0 0)"],
  },
  {
    id: "amber-minimal",
    name: "Amber Minimal",
    description: "Warm amber accent on a clean neutral canvas",
    swatch: ["oklch(0.7686 0.1647 70.08)", "oklch(0.9869 0.0214 95.27)", "oklch(1 0 0)"],
  },
  {
    id: "violet-bloom",
    name: "Violet Bloom",
    description: "Soft rounded surfaces with a violet signature",
    swatch: ["oklch(0.5393 0.2713 286.74)", "oklch(0.9393 0.0288 266.36)", "oklch(0.994 0 0)"],
  },
  {
    id: "mono",
    name: "Mono",
    description: "Zero radius, monospaced, terminal-grade",
    swatch: ["oklch(0.5555 0 0)", "oklch(0.9702 0 0)", "oklch(1 0 0)"],
  },
];

export const DEFAULT_THEME = "vercel";
export type ColorMode = "light" | "dark" | "system";
