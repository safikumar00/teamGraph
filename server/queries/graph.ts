import type { EntityType } from "../types";

/**
 * Cypher for the Network Explorer graph surface.
 *
 * Node types are passed as a parameter array and matched against `labels(n)`
 * so no label interpolation is required — every query stays fully
 * parameterized. Performance optimisation (label indexes / GDS) is deferred.
 */

export const DEFAULT_GRAPH_TYPES: EntityType[] = [
  "employee",
  "team",
  "project",
  "technology",
  "skill",
];

/**
 * Returns the top-N nodes by degree across the selected types. The first label
 * of `n` that belongs to the requested `$types` is reported as the node's type.
 */
export const graphNodes = `
  MATCH (n)
  WHERE ANY(lbl IN $types WHERE lbl IN labels(n))
    AND ($query IS NULL OR toLower(coalesce(n.name, n.id)) CONTAINS toLower($query))
  WITH n, [lbl IN labels(n) WHERE lbl IN $types][0] AS matchedType, COUNT { (n)--() } AS degree
  RETURN n.id AS id, coalesce(n.name, n.id) AS label, toLower(matchedType) AS type, degree AS weight
  ORDER BY degree DESC
  LIMIT $limit
`;

/** Edges between two nodes that are both in the visible id set. */
export const graphEdges = `
  MATCH (a)-[r]->(b)
  WHERE a.id IN $ids AND b.id IN $ids
  RETURN elementId(r) AS id, a.id AS source, b.id AS target, type(r) AS relType
  LIMIT $limit
`;

/** All relationships touching a given entity ref (either direction). */
export const relationshipsFor = `
  MATCH (a)-[r]->(b)
  WHERE (a.id = $id AND $entityType IN labels(a))
     OR (b.id = $id AND $entityType IN labels(b))
  RETURN
    elementId(r) AS id,
    type(r) AS relType,
    a.id AS fromId, labels(a)[0] AS fromType,
    b.id AS toId, labels(b)[0] AS toType
`;

/** Lightweight query used by the global command-palette search. */
export const searchNodes = `
  MATCH (n)
  WHERE $query IS NULL OR toLower(coalesce(n.name, n.id)) CONTAINS toLower($query)
  WITH n, labels(n)[0] AS nodeType
  WHERE nodeType IN $types
  RETURN n.id AS id, nodeType AS type, coalesce(n.name, n.id) AS title, coalesce(n.role, n.code, n.category, n.industry, n.issuer, '') AS subtitle
  ORDER BY title
  LIMIT $limit
`;