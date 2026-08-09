/**
 * Cypher powering the Insights surface.
 *
 * Each insight is a small, focused graph query. Composition of the final
 * InsightCard DTOs happens in the mapper/insight composer (server/mapper),
 * never inside a service — services only orchestrate the repository.
 */

export const mostConnectedEmployee = `
  MATCH (e:Employee)
  WITH e, COUNT { (e)--() } AS degree
  RETURN e.id AS id, e.name AS name, e.role AS role, degree
  ORDER BY degree DESC
  LIMIT 1
`;

export const mostMentor = `
  MATCH (e:Employee)
  OPTIONAL MATCH (e)-[:MENTORED]->(mentee:Employee)
  WITH e, count(mentee) AS mentees
  RETURN e.id AS id, e.name AS name, e.experienceYears AS experienceYears, mentees
  ORDER BY mentees DESC, e.experienceYears DESC
  LIMIT 1
`;

export const topTechnology = `
  MATCH (tech:Technology)
  OPTIONAL MATCH (tech)<-[:USES]-(p:Project)
  WITH tech, count(DISTINCT p) AS projects, tech.adoption AS adoption
  RETURN tech.id AS id, tech.name AS name, projects, adoption
  ORDER BY adoption DESC, projects DESC
  LIMIT 1
`;

export const rareSkills = `
  MATCH (s:Skill)
  OPTIONAL MATCH (s)<-[:HAS_SKILL]-(e:Employee)
  WITH s, count(DISTINCT e) AS holders
  RETURN s.id AS id, s.name AS name, s.category AS category, holders
  ORDER BY holders ASC
`;

export const riskyProjects = `
  MATCH (p:Project)
  WHERE p.risk = 'High' OR p.status = 'At Risk'
  OPTIONAL MATCH (p)<-[:WORKED_ON]-(e:Employee)
  WITH p, count(DISTINCT e) AS members
  RETURN p.id AS id, p.name AS name, p.status AS status, p.risk AS risk, members
  ORDER BY p.risk DESC
`;

export const mostCollaborativeTeam = `
  MATCH (t:Team)
  OPTIONAL MATCH (t)<-[:WORKS_IN]-(eA:Employee)-[:WORKED_ON]->(shared:Project)<-[:WORKED_ON]-(eB:Employee)-[:WORKS_IN]->(other:Team)
  WHERE other <> t
  WITH t, count(DISTINCT other) AS partners
  RETURN t.id AS id, t.name AS name, t.focus AS focus, partners
  ORDER BY partners DESC
  LIMIT 1
`;

export const knowledgeSpread = `
  MATCH (s:Skill)
  OPTIONAL MATCH (s)<-[:HAS_SKILL]-(e:Employee)
  WITH s, count(DISTINCT e) AS holders
  RETURN
      count(s) AS total,
      count(s) AS skills,
      sum(CASE WHEN holders >= 5 THEN 1 ELSE 0 END) AS wellCovered
  LIMIT 1
`;