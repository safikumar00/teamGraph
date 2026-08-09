import type { VercelRequest, VercelResponse } from "@vercel/node";
import apiMiddleware from "../server/api-middleware.js";

/**
 * Vercel serverless catch-all for all /api/* routes.
 *
 * Static import (not dynamic) ensures @vercel/node can trace and bundle all
 * transitive dependencies (neo4j-driver, CognoGraphRepository, etc.) at
 * build time rather than failing at runtime with FUNCTION_INVOCATION_FAILED.
 *
 * The repository inside api-middleware is lazily initialised on first request,
 * so a missing env var returns a structured JSON 500 rather than crashing
 * the function before the handler body executes.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await apiMiddleware(req as any, res as any, () => {
    // no-op: all /api/* routes are handled inside apiMiddleware
  });
}
