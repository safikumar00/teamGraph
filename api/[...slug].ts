import type { VercelRequest, VercelResponse } from "@vercel/node";
import apiMiddleware from "../server/api-middleware.js";

/**
 * Vercel serverless catch-all for all /api/* routes.
 *
 * The middleware uses lazy singleton initialisation — the driver is created
 * on first use within each cold-start container, and the repository singleton
 * is reset after each request so the next warm invocation creates a fresh
 * driver rather than reusing a stale bolt socket that the server has closed.
 *
 * We deliberately do NOT close the driver inside this handler:
 * closing the driver synchronously in finally can race with the response
 * write and also interferes with the health-check code path which initialises
 * the driver separately.  Instead we rely on the 1-connection pool + short
 * timeouts set in config.ts to prevent stale-socket errors.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await apiMiddleware(req as any, res as any, () => {});
}
