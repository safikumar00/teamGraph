import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Vercel serverless catch-all for /api/* routes.
 *
 * The repository is initialised lazily inside the handler — NOT at module load
 * time — so that a missing env var returns a structured 500 JSON response rather
 * than crashing the function before the handler even runs (FUNCTION_INVOCATION_FAILED).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Lazy import keeps cold-start errors catchable.
  let apiMiddleware: (req: any, res: any, next: () => void) => Promise<void>;
  try {
    const mod = await import("../server/api-middleware");
    apiMiddleware = mod.default;
  } catch (err: any) {
    console.error("[api/slug] failed to import api-middleware:", err);
    res.status(500).json({ error: "Server initialisation failed", detail: err?.message || String(err) });
    return;
  }

  await apiMiddleware(req, res, () => {
    // No matching route inside middleware — already handled with 404 there.
  });
}
