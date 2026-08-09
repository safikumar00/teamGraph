import type { EntityType } from "../types.js";

/**
 * Cypher for the remaining entity surfaces (teams, skills, technologies,
 * clients, certifications).
 *
 * The canonical graph model has NO direct Team→Project, Team→Skill,
 * Team→Technology, Skill↔Technology, or Project→Team relationships. Those DTO
 * fields are therefore DERIVED through the canonical Employee/Project hubs:
 *  - Team.projectIds / skillIds / technologyIds — from the team's members.
 *  - Team.collaboratesWith — teams sharing a project via their members.
 *  - Skill.technologyIds / Technology.skillIds — co-occurrence on Employees.
 *  - Client.teamIds — teams whose members worked on the client's projects.
 * No COLLABORATES_WITH, OWNS, OWNED_BY, or RELATES_TO edges are used.
 */

export const listTeams = `
  MATCH (t:Team)
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(e:Employee)
    RETURN collect(DISTINCT e.id) AS memberIds
  }
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(e:Employee)-[:WORKED_ON]->(p:Project)
    RETURN collect(DISTINCT p.id) AS projectIds
  }
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(e:Employee)-[:HAS_SKILL]->(s:Skill)
    RETURN collect(DISTINCT s.id) AS skillIds
  }
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(e:Employee)-[:USES_TECHNOLOGY]->(tech:Technology)
    RETURN collect(DISTINCT tech.id) AS technologyIds
  }
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(eA:Employee)-[:WORKED_ON]->(shared:Project)<-[:WORKED_ON]-(eB:Employee)-[:WORKS_IN]->(other:Team)
    WHERE other <> t
    RETURN collect(DISTINCT other.id) AS collaboratesWith
  }
  RETURN t, memberIds, projectIds, skillIds, technologyIds, collaboratesWith
  ORDER BY t.name
`;

export const getTeam = `
  MATCH (t:Team {id: $id})
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(e:Employee)
    RETURN collect(DISTINCT e.id) AS memberIds
  }
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(e:Employee)-[:WORKED_ON]->(p:Project)
    RETURN collect(DISTINCT p.id) AS projectIds
  }
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(e:Employee)-[:HAS_SKILL]->(s:Skill)
    RETURN collect(DISTINCT s.id) AS skillIds
  }
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(e:Employee)-[:USES_TECHNOLOGY]->(tech:Technology)
    RETURN collect(DISTINCT tech.id) AS technologyIds
  }
  CALL {
    WITH t
    OPTIONAL MATCH (t)<-[:WORKS_IN]-(eA:Employee)-[:WORKED_ON]->(shared:Project)<-[:WORKED_ON]-(eB:Employee)-[:WORKS_IN]->(other:Team)
    WHERE other <> t
    RETURN collect(DISTINCT other.id) AS collaboratesWith
  }
  RETURN t, memberIds, projectIds, skillIds, technologyIds, collaboratesWith
`;

export const listSkills = `
  MATCH (s:Skill)
  WHERE $query IS NULL OR toLower(s.name) CONTAINS toLower($query) OR toLower(s.category) CONTAINS toLower($query)
  CALL {
    WITH s
    OPTIONAL MATCH (s)<-[:HAS_SKILL]-(e:Employee)
    RETURN collect(DISTINCT e.id) AS employeeIds
  }
  CALL {
    WITH s
    OPTIONAL MATCH (s)<-[:REQUIRES_SKILL]-(p:Project)
    RETURN collect(DISTINCT p.id) AS projectIds
  }
  CALL {
    WITH s
    OPTIONAL MATCH (s)<-[:HAS_SKILL]-(e:Employee)-[:USES_TECHNOLOGY]->(tech:Technology)
    RETURN collect(DISTINCT tech.id) AS technologyIds
  }
  RETURN s, employeeIds, projectIds, technologyIds
  ORDER BY s.name
`;

export const getSkill = `
  MATCH (s:Skill {id: $id})
  CALL {
    WITH s
    OPTIONAL MATCH (s)<-[:HAS_SKILL]-(e:Employee)
    RETURN collect(DISTINCT e.id) AS employeeIds
  }
  CALL {
    WITH s
    OPTIONAL MATCH (s)<-[:REQUIRES_SKILL]-(p:Project)
    RETURN collect(DISTINCT p.id) AS projectIds
  }
  CALL {
    WITH s
    OPTIONAL MATCH (s)<-[:HAS_SKILL]-(e:Employee)-[:USES_TECHNOLOGY]->(tech:Technology)
    RETURN collect(DISTINCT tech.id) AS technologyIds
  }
  RETURN s, employeeIds, projectIds, technologyIds
`;

export const listTechnologies = `
  MATCH (tech:Technology)
  WHERE $query IS NULL OR toLower(tech.name) CONTAINS toLower($query) OR toLower(tech.category) CONTAINS toLower($query)
  CALL {
    WITH tech
    OPTIONAL MATCH (tech)<-[:USES_TECHNOLOGY]-(e:Employee)
    RETURN collect(DISTINCT e.id) AS employeeIds
  }
  CALL {
    WITH tech
    OPTIONAL MATCH (tech)<-[:USES]-(p:Project)
    RETURN collect(DISTINCT p.id) AS projectIds
  }
  CALL {
    WITH tech
    OPTIONAL MATCH (tech)<-[:USES_TECHNOLOGY]-(e:Employee)-[:HAS_SKILL]->(s:Skill)
    RETURN collect(DISTINCT s.id) AS skillIds
  }
  RETURN tech, employeeIds, projectIds, skillIds
  ORDER BY tech.name
`;

export const getTechnology = `
  MATCH (tech:Technology {id: $id})
  CALL {
    WITH tech
    OPTIONAL MATCH (tech)<-[:USES_TECHNOLOGY]-(e:Employee)
    RETURN collect(DISTINCT e.id) AS employeeIds
  }
  CALL {
    WITH tech
    OPTIONAL MATCH (tech)<-[:USES]-(p:Project)
    RETURN collect(DISTINCT p.id) AS projectIds
  }
  CALL {
    WITH tech
    OPTIONAL MATCH (tech)<-[:USES_TECHNOLOGY]-(e:Employee)-[:HAS_SKILL]->(s:Skill)
    RETURN collect(DISTINCT s.id) AS skillIds
  }
  RETURN tech, employeeIds, projectIds, skillIds
`;

export const listClients = `
  MATCH (c:Client)
  WHERE $query IS NULL OR toLower(c.name) CONTAINS toLower($query) OR toLower(c.industry) CONTAINS toLower($query) OR toLower(c.region) CONTAINS toLower($query)
  CALL {
    WITH c
    OPTIONAL MATCH (c)<-[:FOR_CLIENT]-(p:Project)
    RETURN collect(DISTINCT p.id) AS projectIds
  }
  CALL {
    WITH c
    OPTIONAL MATCH (c)<-[:FOR_CLIENT]-(p:Project)<-[:WORKED_ON]-(e:Employee)-[:WORKS_IN]->(t:Team)
    RETURN collect(DISTINCT t.id) AS teamIds
  }
  CALL {
    WITH c
    OPTIONAL MATCH (c)<-[:FOR_CLIENT]-(p:Project)-[:USES]->(tech:Technology)
    RETURN collect(DISTINCT tech.id) AS technologyIds
  }
  RETURN c, projectIds, teamIds, technologyIds
  ORDER BY c.name
`;

export const getClient = `
  MATCH (c:Client {id: $id})
  CALL {
    WITH c
    OPTIONAL MATCH (c)<-[:FOR_CLIENT]-(p:Project)
    RETURN collect(DISTINCT p.id) AS projectIds
  }
  CALL {
    WITH c
    OPTIONAL MATCH (c)<-[:FOR_CLIENT]-(p:Project)<-[:WORKED_ON]-(e:Employee)-[:WORKS_IN]->(t:Team)
    RETURN collect(DISTINCT t.id) AS teamIds
  }
  CALL {
    WITH c
    OPTIONAL MATCH (c)<-[:FOR_CLIENT]-(p:Project)-[:USES]->(tech:Technology)
    RETURN collect(DISTINCT tech.id) AS technologyIds
  }
  RETURN c, projectIds, teamIds, technologyIds
`;

export const listCertifications = `
  MATCH (cert:Certification)
  OPTIONAL MATCH (cert)<-[:CERTIFIED_IN]-(e:Employee)
  RETURN cert, collect(DISTINCT e.id) AS employeeIds
  ORDER BY cert.name
`;

export const SEARCHABLE_TYPES: EntityType[] = [
  "employee",
  "team",
  "project",
  "skill",
  "technology",
  "client",
  "certification",
];