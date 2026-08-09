import neo4j, { type Config, type Driver } from "neo4j-driver";
import type { CognodbConfig } from "./config";
import { ConnectionError, toCognodbError } from "./errors";

/**
 * Singleton Neo4j driver lifecycle.
 *
 * A single `Driver` owns the bolt connection pool and is intentionally
 * process-wide. `initDriver` creates it once; `getDriver` returns the live
 * instance; `closeDriver` tears the pool down during graceful shutdown.
 */
let driver: Driver | null = null;

function toDriverConfig(config: CognodbConfig): Config {
  return {
    maxConnectionPoolSize: config.maxConnectionPoolSize,
    connectionAcquisitionTimeout: config.connectionAcquisitionTimeoutMs,
    maxConnectionLifetime: config.maxConnectionLifetimeMs,
    connectionTimeout: config.connectionTimeoutMs,
    logging: {
      level: config.loggingLevel,
      logger: (level, message) =>
        console[level === "debug" ? "log" : level](`[cognodb] ${message}`),
    },
  };
}

/** Creates and caches the singleton driver. Idempotent if already initialised. */
export function initDriver(config: CognodbConfig): Driver {
  if (driver) return driver;
  try {
    driver = neo4j.driver(
      config.uri,
      neo4j.auth.basic(config.username, config.password),
      toDriverConfig(config),
    );
    return driver;
  } catch (error) {
    throw new ConnectionError("Failed to initialise the CognoDB driver.", error);
  }
}

/** Returns the live driver. Throws if `initDriver` has not been called. */
export function getDriver(): Driver {
  if (!driver) {
    throw new ConnectionError(
      "Driver not initialised. Call initDriver(config) before requesting a session.",
    );
  }
  return driver;
}

/** True when a driver instance has been created (not necessarily connected). */
export function hasDriver(): boolean {
  return driver !== null;
}

/** Closes the driver pool. Safe to call multiple times. */
export async function closeDriver(): Promise<void> {
  if (!driver) return;
  const closing = driver;
  driver = null;
  try {
    await closing.close();
  } catch (error) {
    throw toCognodbError(error);
  }
}