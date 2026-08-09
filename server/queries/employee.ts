/**
 * Cypher for Employee nodes and their immediate graph relationships.
 * Every query is parameterized — no string interpolation of user input.
 * `$query IS NULL` guards make each filter optional.
 */

/** List employees, filtered server-side. Returns a node plus derived degree. */
export const listEmployees = `
  MATCH (e:Employee)
  OPTIONAL MATCH (e)-[:WORKS_IN]->(t:Team)
  OPTIONAL MATCH (e)-[:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (e)-[:USES_TECHNOLOGY]->(tech:Technology)
  OPTIONAL MATCH (e)-[:WORKED_ON]->(p:Project)
  OPTIONAL MATCH (e)-[:CERTIFIED_IN]->(c:Certification)
  OPTIONAL MATCH (e)-[:MENTORED]->(m:Employee)
  OPTIONAL MATCH (e)-[:REPORTS_TO]->(mgr:Employee)
  OPTIONAL MATCH (e)<-[:MENTORED]-(mentee:Employee)
  WHERE
    ($query IS NULL
      OR toLower(e.name)    CONTAINS toLower($query)
      OR toLower(e.role)    CONTAINS toLower($query)
      OR toLower(e.department) CONTAINS toLower($query)
      OR toLower(e.location) CONTAINS toLower($query))
    AND ($department IS NULL OR e.department = $department)
    AND ($teamId IS NULL OR t.id = $teamId)
    AND ($skillId IS NULL OR EXISTS { MATCH (e)-[:HAS_SKILL]->(sk:Skill) WHERE sk.id = $skillId })
    AND ($technologyId IS NULL OR EXISTS { MATCH (e)-[:USES_TECHNOLOGY]->(tn:Technology) WHERE tn.id = $technologyId })
  RETURN
    e,
    t.id AS teamId,
    mgr.id AS managerId,
    collect(DISTINCT s.id) AS skillIds,
    collect(DISTINCT tech.id) AS technologyIds,
    collect(DISTINCT p.id) AS projectIds,
    collect(DISTINCT c.id) AS certificationIds,
    collect(DISTINCT m.id) AS mentorIds,
    collect(DISTINCT mentee.id) AS menteeIds
  ORDER BY e.name
`;

/** Fetch a single employee with its full relationship neighbourhood. */
export const getEmployee = `
  MATCH (e:Employee {id: $id})
  OPTIONAL MATCH (e)-[:WORKS_IN]->(t:Team)
  OPTIONAL MATCH (e)-[:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (e)-[:USES_TECHNOLOGY]->(tech:Technology)
  OPTIONAL MATCH (e)-[:WORKED_ON]->(p:Project)
  OPTIONAL MATCH (e)-[:CERTIFIED_IN]->(c:Certification)
  OPTIONAL MATCH (e)-[:MENTORED]->(m:Employee)
  OPTIONAL MATCH (e)-[:REPORTS_TO]->(mgr:Employee)
  OPTIONAL MATCH (e)<-[:MENTORED]-(mentee:Employee)
  RETURN
    e,
    t.id AS teamId,
    mgr.id AS managerId,
    collect(DISTINCT s.id) AS skillIds,
    collect(DISTINCT tech.id) AS technologyIds,
    collect(DISTINCT p.id) AS projectIds,
    collect(DISTINCT c.id) AS certificationIds,
    collect(DISTINCT m.id) AS mentorIds,
    collect(DISTINCT mentee.id) AS menteeIds
`;

/** Distinct departments with headcount, for dashboard breakdowns. */
export const employeeDepartments = `
  MATCH (e:Employee)
  RETURN e.department AS name, count(e) AS count
  ORDER BY count DESC
`;