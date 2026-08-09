import { createCognodbRepository } from "./index.js";
import type { IncomingMessage, ServerResponse } from "http";

// Lazily initialised — created on first request, not at module load time.
// This prevents FUNCTION_INVOCATION_FAILED when the Vercel runtime loads the
// module before environment variables are fully resolved.
let _repository: ReturnType<typeof createCognodbRepository> | null = null;

function getRepository() {
  if (!_repository) {
    _repository = createCognodbRepository();
  }
  return _repository;
}

function getBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJSON(res: ServerResponse, data: any, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sendError(res: ServerResponse, err: any, status = 500) {
  console.error("[api-middleware] error:", err);
  sendJSON(res, { error: err?.message || String(err) }, status);
}

export default async function apiMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname;

  if (!path.startsWith("/api/")) {
    return next();
  }

  try {
    const method = req.method;

    // GET /api/health
    if (path === "/api/health" && method === "GET") {
      try {
        const { getHealth } = await import("./index.js");
        const health = await getHealth();
        return sendJSON(res, health);
      } catch (err: any) {
        return sendJSON(res, { status: "error", error: err?.message || String(err) }, 503);
      }
    }

    // GET /api/stats
    if (path === "/api/stats" && method === "GET") {
      const data = await getRepository().getStats();
      return sendJSON(res, data);
    }

    // GET /api/activity
    if (path === "/api/activity" && method === "GET") {
      const data = await getRepository().getActivity();
      return sendJSON(res, data);
    }

    // GET /api/insights
    if (path === "/api/insights" && method === "GET") {
      const data = await getRepository().getInsights();
      return sendJSON(res, data);
    }

    // GET /api/search
    if (path === "/api/search" && method === "GET") {
      const query = url.searchParams.get("query") || "";
      const data = await getRepository().search(query);
      return sendJSON(res, data);
    }

    // GET /api/certifications
    if (path === "/api/certifications" && method === "GET") {
      const data = await getRepository().listCertifications();
      return sendJSON(res, data);
    }

    // POST /api/relationships
    if (path === "/api/relationships" && method === "POST") {
      const body = await getBody(req);
      const data = await getRepository().getRelationships(body);
      return sendJSON(res, data);
    }

    // POST /api/graph
    if (path === "/api/graph" && method === "POST") {
      const body = await getBody(req);
      const data = await getRepository().getGraph(body);
      return sendJSON(res, data);
    }

    // GET /api/employees/:id or GET/POST /api/employees
    if (path.startsWith("/api/employees")) {
      const idMatch = path.match(/^\/api\/employees\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await getRepository().getEmployee(idMatch[1]);
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
        const data = await getRepository().listEmployees(filters);
        return sendJSON(res, data);
      }
    }

    // GET /api/teams/:id or GET /api/teams
    if (path.startsWith("/api/teams")) {
      const idMatch = path.match(/^\/api\/teams\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await getRepository().getTeam(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/teams" && method === "GET") {
        const data = await getRepository().listTeams();
        return sendJSON(res, data);
      }
    }

    // GET /api/projects/:id or GET/POST /api/projects
    if (path.startsWith("/api/projects")) {
      const idMatch = path.match(/^\/api\/projects\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await getRepository().getProject(idMatch[1]);
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
        const data = await getRepository().listProjects(filters);
        return sendJSON(res, data);
      }
    }

    // GET /api/skills/:id or GET /api/skills
    if (path.startsWith("/api/skills")) {
      const idMatch = path.match(/^\/api\/skills\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await getRepository().getSkill(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/skills" && method === "GET") {
        const query = url.searchParams.get("query") || undefined;
        const data = await getRepository().listSkills(query);
        return sendJSON(res, data);
      }
    }

    // GET /api/technologies/:id or GET /api/technologies
    if (path.startsWith("/api/technologies")) {
      const idMatch = path.match(/^\/api\/technologies\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await getRepository().getTechnology(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/technologies" && method === "GET") {
        const query = url.searchParams.get("query") || undefined;
        const data = await getRepository().listTechnologies(query);
        return sendJSON(res, data);
      }
    }

    // GET /api/clients/:id or GET /api/clients
    if (path.startsWith("/api/clients")) {
      const idMatch = path.match(/^\/api\/clients\/([^/]+)$/);
      if (idMatch && method === "GET") {
        const data = await getRepository().getClient(idMatch[1]);
        if (!data) return sendJSON(res, null, 404);
        return sendJSON(res, data);
      }
      if (path === "/api/clients" && method === "GET") {
        const query = url.searchParams.get("query") || undefined;
        const data = await getRepository().listClients(query);
        return sendJSON(res, data);
      }
    }

    // Path matched starting with /api/ but no handler or wrong method
    return sendJSON(res, { error: "Not found" }, 404);
  } catch (err) {
    return sendError(res, err);
  }
}
