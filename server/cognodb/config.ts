import { ConfigurationError } from "./errors.js";

/**
 * Strongly-typed, validated CognoDB connection configuration.
 *
 * The driver layer never reads `process.env` directly — everything flows
 * through this single validated object so misconfiguration fails fast and loud
 * at startup rather than at first query. Both the canonical COGNODB_* names and
 * the legacy names present in the existing environment file are accepted.
 */
export interface CognodbConfig {
  uri: string;
  username: string;
  password: string;
  database: string;
  maxConnectionPoolSize: number;
  connectionAcquisitionTimeoutMs: number;
  maxConnectionLifetimeMs: number;
  connectionTimeoutMs: number;
  loggingLevel: "error" | "warn" | "info" | "debug";
}

const DEFAULTS: Omit<CognodbConfig, "uri" | "username" | "password"> = {
  database: "neo4j",
  maxConnectionPoolSize: 50,
  connectionAcquisitionTimeoutMs: 60_000,
  maxConnectionLifetimeMs: 3_600_000,
  connectionTimeoutMs: 30_000,
  loggingLevel: "warn",
};

function optionalInt(env: NodeJS.ProcessEnv, key: string, fallback: number): number {
  const raw = env[key];
  if (!raw || !raw.trim()) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new ConfigurationError(
      `Environment variable ${key} must be a positive integer, received "${raw}".`,
    );
  }
  return parsed;
}

/** Builds and validates the CognoDB configuration from the environment. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): CognodbConfig {
  const uri = (env.COGNODB_URI ?? env.connection_uri ?? "").trim();
  const username = (env.COGNODB_USERNAME ?? env.username ?? "").trim();
  const password = (env.COGNODB_PASSWORD ?? env.password ?? "").trim();

  if (!uri) {
    throw new ConfigurationError(
      "Missing CognoDB connection URI. Set COGNODB_URI (or connection_uri).",
    );
  }
  if (!username || !password) {
    throw new ConfigurationError(
      "Missing CognoDB credentials. Set COGNODB_USERNAME and COGNODB_PASSWORD.",
    );
  }

  const loggingLevel = (env.COGNODB_LOGGING_LEVEL?.trim() ||
    DEFAULTS.loggingLevel) as CognodbConfig["loggingLevel"];
  if (!["error", "warn", "info", "debug"].includes(loggingLevel)) {
    throw new ConfigurationError(
      `COGNODB_LOGGING_LEVEL must be error|warn|info|debug, received "${loggingLevel}".`,
    );
  }

  return {
    uri,
    username,
    password,
    database: env.COGNODB_DATABASE?.trim() || DEFAULTS.database,
    maxConnectionPoolSize: optionalInt(env, "COGNODB_POOL_SIZE", DEFAULTS.maxConnectionPoolSize),
    connectionAcquisitionTimeoutMs: optionalInt(
      env,
      "COGNODB_ACQUISITION_TIMEOUT_MS",
      DEFAULTS.connectionAcquisitionTimeoutMs,
    ),
    maxConnectionLifetimeMs: optionalInt(
      env,
      "COGNODB_MAX_CONNECTION_LIFETIME_MS",
      DEFAULTS.maxConnectionLifetimeMs,
    ),
    connectionTimeoutMs: optionalInt(
      env,
      "COGNODB_CONNECTION_TIMEOUT_MS",
      DEFAULTS.connectionTimeoutMs,
    ),
    loggingLevel,
  };
}