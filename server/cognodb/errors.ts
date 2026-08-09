/** Typed error hierarchy for the CognoDB connection + data layer. */

export class CognodbError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "CognodbError";
  }
}

export class ConfigurationError extends CognodbError {
  constructor(message: string, cause?: unknown) {
    super(message, "CONFIGURATION_ERROR", cause);
    this.name = "ConfigurationError";
  }
}

export class ConnectionError extends CognodbError {
  constructor(message: string, cause?: unknown) {
    super(message, "CONNECTION_ERROR", cause);
    this.name = "ConnectionError";
  }
}

export class QueryError extends CognodbError {
  constructor(message: string, cause?: unknown) {
    super(message, "QUERY_ERROR", cause);
    this.name = "QueryError";
  }
}

export class MappingError extends CognodbError {
  constructor(message: string, cause?: unknown) {
    super(message, "MAPPING_ERROR", cause);
    this.name = "MappingError";
  }
}

/** Normalises any thrown value into the typed hierarchy. */
export function toCognodbError(error: unknown): CognodbError {
  if (error instanceof CognodbError) return error;
  const message = error instanceof Error ? error.message : String(error);
  return new QueryError(message, error);
}