import type { Record as Neo4jRecord } from "neo4j-driver";
import type {
  Certification,
  Client,
  Employee,
  GraphEdge,
  GraphNode,
  Project,
  Relationship,
  SearchResult,
  Skill,
  Team,
  Technology,
} from "../dto";
import type {
  EntityType,
  GraphRelationshipType,
  RelationshipType,
} from "../types";
import { MappingError } from "../cognodb/errors";

/**
 * Record → DTO mappers. Neo4j records are converted here into the public DTOs
 * and never leak upward. Relationship labels stored on graph edges are also
 * translated to the frontend's coarser `RelationshipType` vocabulary here.
 */

/** Graph relationship label → frontend relationship type. */
const RELATIONSHIP_MAP: Record<GraphRelationshipType, RelationshipType> = {
  WORKS_IN: "WORKS_IN",
  WORKED_ON: "WORKED_ON",
  HAS_SKILL: "HAS_SKILL",
  USES_TECHNOLOGY: "USES",
  USES: "USES",
  REQUIRES_SKILL: "HAS_SKILL",
  REPORTS_TO: "REPORTS_TO",
  MENTORED: "MENTORED",
  CERTIFIED_IN: "CERTIFIED_IN",
  FOR_CLIENT: "FOR_CLIENT",
  DEPENDS_ON: "DEPENDS_ON",
};

export function mapRelationshipType(relType: string): RelationshipType {
  return (RELATIONSHIP_MAP as Record<string, RelationshipType>)[relType] ?? "RELATED_TO";
}

function nodeProps<P = Record<string, unknown>>(record: Neo4jRecord, key: string): P {
  const value = record.get(key) as { properties: P } | null;
  if (!value || typeof value !== "object" || !("properties" in value)) {
    throw new MappingError(`Expected a graph node at record key "${key}".`);
  }
  return value.properties;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : fallback;
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function initials(name: string, fallback?: string): string {
  if (fallback && fallback.trim()) return fallback;
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function recordToEmployee(record: Neo4jRecord): Employee {
  const p = nodeProps<Employee & { initials?: string }>(record, "e");
  const skillIds = strArray(record.get("skillIds"));
  const technologyIds = strArray(record.get("technologyIds"));
  const projectIds = strArray(record.get("projectIds"));
  const certificationIds = strArray(record.get("certificationIds"));
  const mentorIds = strArray(record.get("mentorIds"));
  const menteeIds = strArray(record.get("menteeIds"));
  const teamId = str(record.get("teamId"));
  const managerId = str(record.get("managerId")) || null;
  const connections =
    (teamId ? 1 : 0) +
    skillIds.length + technologyIds.length + projectIds.length +
    certificationIds.length + mentorIds.length + menteeIds.length +
    (managerId ? 1 : 0);
  return {
    id: p.id,
    name: p.name,
    initials: initials(p.name, p.initials),
    role: p.role,
    seniority: p.seniority,
    department: p.department,
    teamId,
    managerId,
    location: p.location,
    email: p.email,
    experienceYears: num(p.experienceYears),
    joinedAt: p.joinedAt,
    skillIds,
    technologyIds,
    projectIds,
    certificationIds,
    mentorIds,
    menteeIds,
    connections,
  };
}

export function recordToTeam(record: Neo4jRecord): Team {
  const p = nodeProps<Team>(record, "t");
  return {
    id: p.id,
    name: p.name,
    department: p.department,
    leadId: p.leadId,
    memberIds: strArray(record.get("memberIds")),
    projectIds: strArray(record.get("projectIds")),
    skillIds: strArray(record.get("skillIds")),
    technologyIds: strArray(record.get("technologyIds")),
    collaboratesWith: strArray(record.get("collaboratesWith")),
    focus: p.focus,
  };
}

export function recordToProject(record: Neo4jRecord): Project {
  const p = nodeProps<Project>(record, "p");
  return {
    id: p.id,
    name: p.name,
    code: p.code,
    summary: p.summary,
    status: p.status,
    risk: p.risk,
    progress: num(p.progress),
    clientId: str(record.get("clientId")),
    teamId: p.teamId,
    memberIds: strArray(record.get("memberIds")),
    technologyIds: strArray(record.get("technologyIds")),
    skillIds: strArray(record.get("skillIds")),
    dependsOn: strArray(record.get("dependsOn")),
    startedAt: p.startedAt,
    targetAt: p.targetAt,
  };
}

export function recordToSkill(record: Neo4jRecord): Skill {
  const p = nodeProps<Skill>(record, "s");
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    rarity: p.rarity,
    employeeIds: strArray(record.get("employeeIds")),
    projectIds: strArray(record.get("projectIds")),
    technologyIds: strArray(record.get("technologyIds")),
  };
}

export function recordToTechnology(record: Neo4jRecord): Technology {
  const p = nodeProps<Technology>(record, "tech");
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    adoption: num(p.adoption),
    projectIds: strArray(record.get("projectIds")),
    employeeIds: strArray(record.get("employeeIds")),
    skillIds: strArray(record.get("skillIds")),
  };
}

export function recordToClient(record: Neo4jRecord): Client {
  const p = nodeProps<Client>(record, "c");
  return {
    id: p.id,
    name: p.name,
    industry: p.industry,
    region: p.region,
    since: p.since,
    health: p.health,
    projectIds: strArray(record.get("projectIds")),
    teamIds: strArray(record.get("teamIds")),
    technologyIds: strArray(record.get("technologyIds")),
  };
}

export function recordToCertification(record: Neo4jRecord): Certification {
  const p = nodeProps<Certification>(record, "cert");
  return {
    id: p.id,
    name: p.name,
    issuer: p.issuer,
    employeeIds: strArray(record.get("employeeIds")),
  };
}

export function recordToRelationship(record: Neo4jRecord): Relationship {
  const fromType = str(record.get("fromType")).toLowerCase() as EntityType;
  const toType = str(record.get("toType")).toLowerCase() as EntityType;
  return {
    id: str(record.get("id")),
    type: mapRelationshipType(str(record.get("relType"))),
    from: { type: fromType, id: str(record.get("fromId")) },
    to: { type: toType, id: str(record.get("toId")) },
  };
}

export function recordToGraphNode(record: Neo4jRecord): GraphNode {
  // Coordinates are added later by the radial layout transform.
  return {
    id: str(record.get("id")),
    label: str(record.get("label")),
    type: str(record.get("type")).toLowerCase() as EntityType,
    x: 0,
    y: 0,
    size: Math.max(6, Math.min(16, 5 + num(record.get("weight")) * 0.6)),
  };
}

export function recordToGraphEdge(record: Neo4jRecord): GraphEdge {
  return {
    id: str(record.get("id")),
    source: str(record.get("source")),
    target: str(record.get("target")),
    type: mapRelationshipType(str(record.get("relType"))),
  };
}

export function recordToSearchResult(record: Neo4jRecord): SearchResult {
  return {
    id: str(record.get("id")),
    type: str(record.get("type")).toLowerCase() as EntityType,
    title: str(record.get("title")),
    subtitle: str(record.get("subtitle")),
  };
}

export { computeRadialLayout } from "./graph-layout";
export { composeInsights, type InsightRecords } from "./insight-composer";