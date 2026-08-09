import apiMiddleware from "../server/api-middleware.ts";

/**
 * Vercel serverless function that forwards all `/api/*` requests to the existing
 * `server/api-middleware.ts`. This enables the same API routes in production
 * deployments without altering the development setup.
 */
export default async function handler(req: any, res: any) {
  // The middleware expects a Node.js IncomingMessage and ServerResponse.
  // Vercel provides compatible objects, so we can invoke it directly.
  // Provide a no‑op `next` callback because this handler is the final endpoint.
  await apiMiddleware(req, res, () => {});
}
