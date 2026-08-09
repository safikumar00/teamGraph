/**
 * Data Transfer Objects — the only shapes the UI ever receives from the backend.
 *
 * Neo4j records are never leaked past the mapper. These interfaces match the
 * frontend contract (src/data/types.ts) field-for-field so the repository swap
 * requires no UI changes.
 */
import type { EntityType, EntityRef, RelationshipType } from "../types";

export type Seniority = "Junior" | "Mid" | "Senior" | "Staff" | "Principal";
export type ProjectStatus = "Active" | "Planning" | "At Risk" | "Completed" | "On Hold";
export type RiskLevel = "Low" | "Medium" | "High";
export type ClientHealth = "Healthy" | "Watch" | "Escalated";
export type SkillRarity = "Common" | "Uncommon" | "Rare" | "Critical";

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  seniority: Seniority;
  department: string;
  teamId: string;
  managerId: string | null;
  location: string;
  email: string;
  experienceYears: number;
  joinedAt: string;
  skillIds: string[];
  technologyIds: string[];
  projectIds: string[];
  certificationIds: string[];
  mentorIds: string[];
  menteeIds: string[];
  connections: number;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  leadId: string;
  memberIds: string[];
  projectIds: string[];
  skillIds: string[];
  technologyIds: string[];
  collaboratesWith: string[];
  focus: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  summary: string;
  status: ProjectStatus;
  risk: RiskLevel;
  progress: number;
  clientId: string;
  teamId: string;
  memberIds: string[];
  technologyIds: string[];
  skillIds: string[];
  dependsOn: string[];
  startedAt: string;
  targetAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  rarity: SkillRarity;
  employeeIds: string[];
  projectIds: string[];
  technologyIds: string[];
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  adoption: number;
  projectIds: string[];
  employeeIds: string[];
  skillIds: string[];
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  region: string;
  since: string;
  health: ClientHealth;
  projectIds: string[];
  teamIds: string[];
  technologyIds: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  employeeIds: string[];
}

export interface Relationship {
  id: string;
  type: RelationshipType;
  from: EntityRef;
  to: EntityRef;
  since?: string;
  weight?: number;
}

export interface ActivityEvent {
  id: string;
  at: string;
  relationship: RelationshipType;
  actor: EntityRef;
  target: EntityRef;
  label: string;
}

export interface OrgStats {
  employees: number;
  teams: number;
  projects: number;
  skills: number;
  technologies: number;
  clients: number;
  relationships: number;
  departments: { name: string; count: number }[];
  relationshipMix: { type: RelationshipType; count: number }[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  x: number;
  y: number;
  size: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
}

export interface GraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SearchResult {
  id: string;
  type: EntityType;
  title: string;
  subtitle: string;
}

export interface InsightCard {
  id: string;
  title: string;
  question: string;
  headline: string;
  detail: string;
  metric: string;
  metricLabel: string;
  score: number;
  severity: "info" | "positive" | "warning" | "critical";
  entities: { label: string; type: EntityType; id: string }[];
}