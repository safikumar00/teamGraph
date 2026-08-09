import neo4j, {
  type ManagedTransaction,
  type QueryResult,
  type Session,
} from "neo4j-driver";
import { getDriver } from "./driver";
import { toCognodbError } from "./errors";

/**
 * Session factory + transaction helpers.
 *
 * Every database interaction flows through this module so that:
 *  - sessions are always closed (no connection leaks);
 *  - read/write access modes are explicit;
 *  - errors are normalised to the typed hierarchy.
 */

export type AccessMode = "read" | "write";

function openSession(mode: AccessMode, database?: string): Session {
  return getDriver().session({
    defaultAccessMode: mode === "write" ? neo4j.session.WRITE : neo4j.session.READ,
    ...(database ? { database } : {}),
  });
}

async function runAndClose(
  session: Session,
  cypher: string,
  params: Record<string, unknown>,
): Promise<QueryResult> {
  try {
    return await session.run(cypher, params);
  } catch (error) {
    throw toCognodbError(error);
  } finally {
    await session.close().catch(() => undefined);
  }
}

/** Runs a read query and returns the raw `QueryResult`. */
export function runRead(
  cypher: string,
  params: Record<string, unknown> = {},
  database?: string,
): Promise<QueryResult> {
  return runAndClose(openSession("read", database), cypher, params);
}

/** Runs a write query and returns the raw `QueryResult`. */
export function runWrite(
  cypher: string,
  params: Record<string, unknown> = {},
  database?: string,
): Promise<QueryResult> {
  return runAndClose(openSession("write", database), cypher, params);
}

/** Runs `work` inside a managed read transaction (driver retries transient errors). */
export async function withReadTransaction<T>(
  work: (tx: ManagedTransaction) => Promise<T>,
  database?: string,
): Promise<T> {
  const session = openSession("read", database);
  try {
    return await session.executeRead(work);
  } catch (error) {
    throw toCognodbError(error);
  } finally {
    await session.close().catch(() => undefined);
  }
}

/** Runs `work` inside a managed write transaction. */
export async function withWriteTransaction<T>(
  work: (tx: ManagedTransaction) => Promise<T>,
  database?: string,
): Promise<T> {
  const session = openSession("write", database);
  try {
    return await session.executeWrite(work);
  } catch (error) {
    throw toCognodbError(error);
  } finally {
    await session.close().catch(() => undefined);
  }
}