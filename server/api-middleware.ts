import type { IncomingMessage, ServerResponse } from "http";
import { ensureBackend, getBackend } from "./index.js";

function getBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJSON(res: ServerResponse, data: any, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function describeError(err: unknown) {
  if (!err || typeof err !== "object") {
    return { message: String(err) };
  }

  const error = err as Record<string, unknown>;
  const cause = error.cause as unknown;
  const describeCause =
    cause && typeof cause === "object"
      ? {
          name: typeof (cause as Record<string, unknown>).name === "string" ? (cause as Record<string, unknown>).name : undefined,
          code: typeof (cause as Record<string, unknown>).code === "string" ? (cause as Record<string, unknown>).code : undefined,
          message:
            typeof (cause as Record<string, unknown>).message === "string"
              ? (cause as Record<string, unknown>).message
              : undefined,
        }
      : undefined;

  return {
    name: typeof error.name === "string" ? error.name : undefined,
    code: typeof error.code === "string" ? error.code : undefined,
    message: typeof error.message === "string" ? error.message : String(err),
    cause: describeCause,
  };
}

function logError(scope: string, err: unknown, context: Record<string, unknown> = {}) {
  console.error(`[api-middleware] ${scope}`, { ...context, ...describeError(err) });
}

function sendError(
  res: ServerResponse,
  err: unknown,
  status = 500,
  context: Record<string, unknown> = {},
) {
  logError("request failed", err, context);
  sendJSON(res, { error: err instanceof Error ? err.message : String(err) }, status);
}

export default async function apiMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname;

  if (!path.startsWith("/api/")) {
    return next();
  }

  try {
    await ensureBackend();
    const repository = getBackend().repository;
    const method = req.method;

    // GET /api/health
    if (path === "/api/health" && method === "GET") {
      try {
        const { healthCheck } = await import("./cognodb/index.js");
        const health = await healthCheck(getBackend().config);
        return sendJSON(res, health);
      } catch (err) {
        logError("health check failed", err, { path, method });
        return sendJSON(
          res,
          { status: "error", error: err instanceof Error ? err.message : String(err) },
          503,
        );
      }
    }

    // GET /api/stats
    if (path === "/api/stats" && method === "GET") {
      const data = await repository.getStats();
      return sendJSON(res, data);
    }

    // GET /api/activity
    if (path === "/api/activity" && method === "GET") {
      const data = await repository.getActivity();
      return sendJSON(res, data);
    }

    // GET /api/insights
    if (path === "/api/insights" && method === "GET") {
      const data = await repository.getInsights();
      return sendJSON(res, data);
    }

    // GET /api/search
    if (path === "/api/search" && method === "GET") {
      const query = url.searchParams.get("query") || "";
      const data = await repository.search(query);
      return sendJSON(res, data);
    }

    // GET /api/certifications
    if (path === "/api/certifications" && method === "GET") {
      const data = await repository.listCertifications();
      return sendJSON(res, data);
    }

    // POST /api/relationships
    if (path === "/api/relationships" && method === "POST") {
      const body = await getBody(req);
      const data = await repository.getRelationships(body);
      return sendJSON(res, data);
    }

    // POST /api/graph
    if (path === "/api/graph" && method === "POST") {
      const body = await getBody(req);
      const data = await repository.getGraph(body);
      return sendJSON(res, data);
    }

    // GET /api/employees/:id or GET/POST /api/employees
    if (path.startsWith("/api/employees")) {
      const idMatch = path.match(/^\/api\/employees\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await repository.getEmployee(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/employees") {
        let filters = {};
        if (method === "POST") {
          filters = await getBody(req);
        } else if (method === "GET") {
          filters = {
            query: url.searchParams.get("query") || undefined,
            department: url.searchParams.get("department") || undefined,
            teamId: url.searchParams.get("teamId") || undefined,
            skillId: url.searchParams.get("skillId") || undefined,
            technologyId: url.searchParams.get("technologyId") || undefined,
          };
        }
        const data = await repository.listEmployees(filters);
        return sendJSON(res, data);
      }
    }

    // GET /api/teams/:id or GET /api/teams
    if (path.startsWith("/api/teams")) {
      const idMatch = path.match(/^\/api\/teams\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await repository.getTeam(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/teams" && method === "GET") {
        const data = await repository.listTeams();
        return sendJSON(res, data);
      }
    }

    // GET /api/projects/:id or GET/POST /api/projects
    if (path.startsWith("/api/projects")) {
      const idMatch = path.match(/^\/api\/projects\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await repository.getProject(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/projects") {
        let filters = {};
        if (method === "POST") {
          filters = await getBody(req);
        } else if (method === "GET") {
          filters = {
            query: url.searchParams.get("query") || undefined,
            status: url.searchParams.get("status") || undefined,
            clientId: url.searchParams.get("clientId") || undefined,
            technologyId: url.searchParams.get("technologyId") || undefined,
          };
        }
        const data = await repository.listProjects(filters);
        return sendJSON(res, data);
      }
    }

    // GET /api/skills/:id or GET /api/skills
    if (path.startsWith("/api/skills")) {
      const idMatch = path.match(/^\/api\/skills\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await repository.getSkill(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/skills" && method === "GET") {
        const query = url.searchParams.get("query") || undefined;
        const data = await repository.listSkills(query);
        return sendJSON(res, data);
      }
    }

    // GET /api/technologies/:id or GET /api/technologies
    if (path.startsWith("/api/technologies")) {
      const idMatch = path.match(/^\/api\/technologies\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await repository.getTechnology(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/technologies" && method === "GET") {
        const query = url.searchParams.get("query") || undefined;
        const data = await repository.listTechnologies(query);
        return sendJSON(res, data);
      }
    }

    // GET /api/clients/:id or GET /api/clients
    if (path.startsWith("/api/clients")) {
      const idMatch = path.match(/^\/api\/clients\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await repository.getClient(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/clients" && method === "GET") {
        const query = url.searchParams.get("query") || undefined;
        const data = await repository.listClients(query);
        return sendJSON(res, data);
      }
    }

    // Path matched starting with /api/ but no handler or wrong method
    return sendJSON(res, { error: "Not found" }, 404);
  } catch (err) {
    return sendError(res, err, 500, { path, method: req.method });
  }
}
