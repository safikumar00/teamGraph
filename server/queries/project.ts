/**
 * Cypher for Project nodes and their graph relationships.
 * Fully parameterized; filters are optional via `$x IS NULL` guards.
 */

export const listProjects = `
  MATCH (p:Project)
  OPTIONAL MATCH (p)-[:FOR_CLIENT]->(c:Client)
  OPTIONAL MATCH (p)<-[:WORKED_ON]-(e:Employee)
  OPTIONAL MATCH (p)-[:USES]->(tech:Technology)
  OPTIONAL MATCH (p)-[:REQUIRES_SKILL]->(s:Skill)
  OPTIONAL MATCH (p)-[:DEPENDS_ON]->(dep:Project)
  WHERE
    ($query IS NULL
      OR toLower(p.name)    CONTAINS toLower($query)
      OR toLower(p.code)    CONTAINS toLower($query)
      OR toLower(p.summary) CONTAINS toLower($query))
    AND ($status IS NULL OR $status = 'All' OR p.status = $status)
    AND ($clientId IS NULL OR c.id = $clientId)
    AND ($technologyId IS NULL OR EXISTS { MATCH (p)-[:USES]->(tn:Technology) WHERE tn.id = $technologyId })
  RETURN
    p,
    c.id AS clientId,
    collect(DISTINCT e.id) AS memberIds,
    collect(DISTINCT tech.id) AS technologyIds,
    collect(DISTINCT s.id) AS skillIds,
    collect(DISTINCT dep.id) AS dependsOn
  ORDER BY p.name
`;

export const getProject = `
  MATCH (p:Project {id: $id})
  OPTIONAL MATCH (p)-[:FOR_CLIENT]->(c:Client)
  OPTIONAL MATCH (p)<-[:WORKED_ON]-(e:Employee)
  OPTIONAL MATCH (p)-[:USES]->(tech:Technology)
  OPTIONAL MATCH (p)-[:REQUIRES_SKILL]->(s:Skill)
  OPTIONAL MATCH (p)-[:DEPENDS_ON]->(dep:Project)
  RETURN
    p,
    c.id AS clientId,
    collect(DISTINCT e.id) AS memberIds,
    collect(DISTINCT tech.id) AS technologyIds,
    collect(DISTINCT s.id) AS skillIds,
    collect(DISTINCT dep.id) AS dependsOn
`;