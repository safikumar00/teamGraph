import type { Driver } from "neo4j-driver";
import { type CognodbConfig } from "./config";
import { getDriver, hasDriver } from "./driver";
import { ConnectionError, toCognodbError } from "./errors";

export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  driverInitialised: boolean;
  connectivity: boolean;
  database?: string;
  serverInfo?: { version: string; protocolVersion: number };
  latencyMs?: number;
  error?: string;
}

/** Lightweight connectivity probe for readiness checks. */
export async function verifyConnectivity(driver: Driver = getDriver()): Promise<void> {
  try {
    await driver.verifyConnectivity();
  } catch (error) {
    throw new ConnectionError("CognoDB connectivity check failed.", error);
  }
}

/** Full health snapshot for `/healthz`-style endpoints. */
export async function healthCheck(
  config?: Pick<CognodbConfig, "database">,
): Promise<HealthStatus> {
  if (!hasDriver()) {
    return { status: "down", driverInitialised: false, connectivity: false };
  }
  const driver = getDriver();
  const started = Date.now();
  try {
    await driver.verifyConnectivity();
    const info = await driver.getServerInfo();
    return {
      status: "ok",
      driverInitialised: true,
      connectivity: true,
      database: config?.database,
      serverInfo: {
        version: info.version,
        protocolVersion: info.protocolVersion,
      },
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    return {
      status: "degraded",
      driverInitialised: true,
      connectivity: false,
      database: config?.database,
      latencyMs: Date.now() - started,
      error: toCognodbError(error).message,
    };
  }
}