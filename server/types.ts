/**
 * Shared graph-primitive + contract types for the TeamGraph backend.
 *
 * This module mirrors the frontend contract (src/data/types.ts) so the backend
 * repository can satisfy the exact interface the UI already consumes. The
 * backend owns its own copy deliberately — server code never imports from
 * `src/` — keeping the two layers decoupled and the swap seam clean.
 */

/** Node labels stored in the graph database. */
export type EntityType =
  | "employee"
  | "team"
  | "project"
  | "skill"
  | "technology"
  | "client"
  | "certification";

/**
 * Canonical relationship type labels stored on graph edges.
 * These are the labels Cypher is written against (see server/queries).
 */
export type GraphRelationshipType =
  | "WORKS_IN"
  | "WORKED_ON"
  | "HAS_SKILL"
  | "USES_TECHNOLOGY"
  | "REPORTS_TO"
  | "MENTORED"
  | "CERTIFIED_IN"
  | "FOR_CLIENT"
  | "USES"
  | "REQUIRES_SKILL"
  | "DEPENDS_ON";

/**
 * Relationship type exposed to the frontend via the repository contract.
 * Note the frontend vocabulary is intentionally coarser than the graph's
 * (e.g. graph `USES_TECHNOLOGY` and `USES` both surface as `USES`).
 * The mapper layer performs this translation — see server/mapper.
 */
export type RelationshipType =
  | "WORKS_IN"
  | "WORKED_ON"
  | "HAS_SKILL"
  | "USES"
  | "MENTORED"
  | "REPORTS_TO"
  | "FOR_CLIENT"
  | "CERTIFIED_IN"
  | "COLLABORATES_WITH"
  | "DEPENDS_ON"
  | "RELATED_TO";

export interface EntityRef {
  type: EntityType;
  id: string;
}

export interface EmployeeFilters {
  query?: string;
  department?: string;
  teamId?: string;
  skillId?: string;
  technologyId?: string;
}

export interface ProjectFilters {
  query?: string;
  status?: string;
  clientId?: string;
  technologyId?: string;
}

export interface GraphOptions {
  types?: EntityType[];
  query?: string;
  focusId?: string;
  limit?: number;
}