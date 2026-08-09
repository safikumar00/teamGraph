/**
 * Cypher powering the dashboard aggregate metrics.
 *
 * Counts and the relationship-type mix come from the live graph. The previous
 * Activity-based feed/growth series relied on a non-canonical `Activity`
 * node; since the canonical model carries no event timestamps, the
 * activity/growth surface is simplified to an empty series until relationship
 * timestamps are introduced in a future phase.
 */

export const orgCounts = `
  MATCH (e:Employee) WITH count(e) AS employees
  MATCH (t:Team)    WITH employees, count(t) AS teams
  MATCH (p:Project) WITH employees, teams, count(p) AS projects
  MATCH (s:Skill)  WITH employees, teams, projects, count(s) AS skills
  MATCH (tech:Technology) WITH employees, teams, projects, skills, count(tech) AS technologies
  MATCH (c:Client) WITH employees, teams, projects, skills, technologies, count(c) AS clients
  CALL { MATCH ()-[r]->() RETURN count(r) AS relationships }
  RETURN employees, teams, projects, skills, technologies, clients, relationships
`;

export const relationshipMix = `
  MATCH ()-[r]->()
  RETURN type(r) AS type, count(r) AS count
  ORDER BY count DESC
`;

export const graphActivity = `
  MATCH (a)-[r]->(b)
  WITH r, a, b, type(r) AS relType
  ORDER BY elementId(r) DESC
  LIMIT 8
  RETURN 
    elementId(r) AS id,
    relType AS type,
    a.id AS fromId,
    labels(a)[0] AS fromType,
    coalesce(a.name, a.id) AS fromName,
    b.id AS toId,
    labels(b)[0] AS toType,
    coalesce(b.name, b.id) AS toName
`;