import type { VercelRequest, VercelResponse } from "@vercel/node";
import apiMiddleware, { resetRepository } from "../server/api-middleware.js";
import { closeDriver } from "../server/cognodb/index.js";

/**
 * Vercel serverless catch-all for all /api/* routes.
 *
 * The bolt connection MUST be closed after each Lambda invocation.
 * In Vercel/Lambda, the container may be reused but the server-side bolt
 * socket has already been closed by CognoDB — leaving the driver open causes
 * "Connection was closed by server" on warm restarts.
 *
 * Closing the driver + resetting the repository singleton ensures each
 * invocation gets a fresh connection.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await apiMiddleware(req as any, res as any, () => {});
  } finally {
    // Release the bolt socket and reset singleton so next invocation reconnects cleanly.
    try {
      await closeDriver();
    } catch {
      // Ignore close errors — response already sent.
    }
    resetRepository();
  }
}
