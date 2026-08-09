import {
  closeDriver,
  healthCheck,
  initDriver,
  loadConfig,
  verifyConnectivity,
  type CognodbConfig,
  type HealthStatus,
} from "./cognodb/index.js";
import { CognoGraphRepository, type GraphRepository } from "./repositories/index.js";
import {
  DashboardService,
  EmployeeService,
  GraphService,
  InsightService,
  ProjectService,
  TeamService,
} from "./services/index.js";

/**
 * Composition root + process lifecycle for the TeamGraph backend.
 *
 * The whole backend is wired here from a single `createBackend()` call:
 * config → driver → repository → services. Graceful shutdown is registered so
 * the driver pool drains on SIGTERM/SIGINT.
 */

export interface BackendServices {
  graph: GraphService;
  employee: EmployeeService;
  project: ProjectService;
  team: TeamService;
  dashboard: DashboardService;
  insights: InsightService;
}

export interface Backend {
  config: CognodbConfig;
  repository: GraphRepository;
  services: BackendServices;
}

let backend: Backend | null = null;
let backendInitPromise: Promise<Backend> | null = null;

function buildServices(repo: GraphRepository): BackendServices {
  return {
    graph: new GraphService(repo),
    employee: new EmployeeService(repo),
    project: new ProjectService(repo),
    team: new TeamService(repo),
    dashboard: new DashboardService(repo),
    insights: new InsightService(repo),
  };
}

/** Builds the backend from the environment without probing the database. */
export function createBackend(): Backend {
  const config = loadConfig();
  initDriver(config);
  const repository = new CognoGraphRepository(config);
  backend = { config, repository, services: buildServices(repository) };
  return backend;
}

/**
 * Builds the backend once per process.
 *
 * This is the safe entry point for serverless/API boundaries: concurrent
 * callers share the same initialization promise, warm invocations reuse the
 * cached singleton.
 */
export async function ensureBackend(): Promise<Backend> {
  if (backend) return backend;
  if (!backendInitPromise) {
    backendInitPromise = Promise.resolve().then(() => createBackend()).catch((error) => {
      backend = null;
      backendInitPromise = null;
      throw error;
    });
  }
  return backendInitPromise;
}

/** Builds the backend and verifies CognoDB connectivity before serving traffic. */
export async function start(): Promise<Backend> {
  const b = await ensureBackend();
  await verifyConnectivity();
  return b;
}

/** Returns the bootstrapped backend, building it lazily on first use. */
export function getBackend(): Backend {
  if (!backend) return createBackend();
  return backend;
}

/** Health snapshot suitable for a `/healthz` endpoint. */
export function getHealth(): Promise<HealthStatus> {
  return healthCheck(getBackend().config);
}

/**
 * Integration point for the frontend swap. Later, `src/data/repository.ts`
 * becomes:
 *   import { createCognodbRepository } from "@/server";
 *   export const repository = createCognodbRepository();
 */
export function createCognodbRepository(): GraphRepository {
  return getBackend().repository;
}

/** Drains the driver pool. Safe to call multiple times. */
export async function shutdown(): Promise<void> {
  backend = null;
  await closeDriver();
}

// --- Graceful shutdown -------------------------------------------------------
// Skip SIGTERM/SIGINT registration in serverless environments (Vercel/Lambda)
// where process.exit() would prematurely terminate a warm container.
const isServerless = !!(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

if (typeof process !== "undefined" && !isServerless) {
  let shuttingDown = false;
  const handle = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[teamgraph] ${signal} received — draining CognoDB driver pool…`);
    try {
      await shutdown();
    } catch (error) {
      console.error("[teamgraph] error during shutdown:", error);
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGTERM", () => handle("SIGTERM"));
  process.on("SIGINT", () => handle("SIGINT"));
}
