import type { CognodbConfig } from "../cognodb";
import { runRead } from "../cognodb";
import {
  composeInsights,
  computeRadialLayout,
  mapRelationshipType,
  recordToClient,
  recordToCertification,
  recordToEmployee,
  recordToGraphEdge,
  recordToGraphNode,
  recordToProject,
  recordToRelationship,
  recordToSearchResult,
  recordToSkill,
  recordToTeam,
  recordToTechnology,
} from "../mapper";
import {
  getClient,
  getEmployee,
  getProject,
  getSkill,
  getTeam,
  getTechnology,
  graphEdges,
  graphNodes,
  listCertifications,
  listClients,
  listEmployees,
  listProjects,
  listSkills,
  listTeams,
  listTechnologies,
  mostCollaborativeTeam,
  mostConnectedEmployee,
  mostMentor,
  rareSkills,
  relationshipMix,
  graphActivity,
  riskyProjects,
  searchNodes,
  SEARCHABLE_TYPES,
  topTechnology,
  knowledgeSpread,
} from "../queries";
import {
  employeeDepartments,
  orgCounts,
  relationshipsFor,
  DEFAULT_GRAPH_TYPES,
} from "../queries";
import type {
  ActivityEvent,
  Certification,
  Client,
  Employee,
  GraphSnapshot,
  InsightCard,
  OrgStats,
  Project,
  Relationship,
  SearchResult,
  Skill,
  Team,
  Technology,
} from "../dto";
import type {
  EmployeeFilters,
  EntityRef,
  GraphOptions,
  ProjectFilters,
} from "../types";
import type { GraphRepository } from "./GraphRepository";

function toNum(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && "toNumber" in val && typeof (val as any).toNumber === "function") {
    return (val as any).toNumber();
  }
  return Number(val);
}

function buildActivityLabel(type: string, fromName: string, toName: string): string {
  switch (type) {
    case "WORKS_IN":
      return `${fromName} joined ${toName}`;
    case "WORKED_ON":
      return `${fromName} joined ${toName}`;
    case "HAS_SKILL":
      return `${fromName} connected to ${toName}`;
    case "USES_TECHNOLOGY":
      return `${fromName} uses ${toName}`;
    case "REPORTS_TO":
      return `${fromName} reports to ${fromName === toName ? 'themselves' : toName}`;
    case "MENTORED":
      return `${fromName} mentors ${toName}`;
    case "CERTIFIED_IN":
      return `${fromName} certified in ${toName}`;
    case "FOR_CLIENT":
      return `${fromName} for client ${toName}`;
    case "USES":
      return `${fromName} uses ${toName}`;
    case "REQUIRES_SKILL":
      return `${fromName} requires skill ${toName}`;
    case "DEPENDS_ON":
      return `${fromName} depends on ${toName}`;
    default:
      return `${fromName} connected to ${toName}`;
  }
}

/**
 * CognoDB-backed implementation of the frontend repository contract.
 *
 * Responsibilities here are strictly data access + mapping: run a query, map
 * its records to DTOs, return them. Composition beyond a single query lives in
 * the service layer; insight composition lives in the mapper composer.
 */
export class CognoGraphRepository implements GraphRepository {
  constructor(private readonly config: CognodbConfig) {}

  private db(): string | undefined {
    return this.config.database || undefined;
  }

  async getStats(): Promise<OrgStats> {
    const [counts, mix, departments] = await Promise.all([
      runRead(orgCounts, {}, this.db()),
      runRead(relationshipMix, {}, this.db()),
      runRead(employeeDepartments, {}, this.db()),
    ]);

    const c = counts.records[0];
    const relationshipMixResult = mix.records.map((r) => ({
      type: mapRelationshipType(r.get("type") as string),
      count: toNum(r.get("count")),
    }));

    // The canonical graph has no event timestamps, so the growth series is
    // empty until relationship timestamps are introduced in a future phase.
    return {
      employees: c ? toNum(c.get("employees")) : 0,
      teams: c ? toNum(c.get("teams")) : 0,
      projects: c ? toNum(c.get("projects")) : 0,
      skills: c ? toNum(c.get("skills")) : 0,
      technologies: c ? toNum(c.get("technologies")) : 0,
      clients: c ? toNum(c.get("clients")) : 0,
      relationships: c ? toNum(c.get("relationships")) : 0,
      departments: departments.records.map((r) => ({
        name: r.get("name") as string,
        count: toNum(r.get("count")),
      })),
      relationshipMix: relationshipMixResult,
    };
  }

  async getActivity(): Promise<ActivityEvent[]> {
    const result = await runRead(graphActivity, {}, this.db());
    return result.records.map((r) => {
      const type = r.get("type") as string;
      const fromName = r.get("fromName") as string;
      const toName = r.get("toName") as string;
      const fromType = (r.get("fromType") as string).toLowerCase() as any;
      const toType = (r.get("toType") as string).toLowerCase() as any;

      return {
        id: r.get("id") as string,
        at: "Active Link",
        relationship: mapRelationshipType(type),
        actor: {
          id: r.get("fromId") as string,
          type: fromType,
        },
        target: {
          id: r.get("toId") as string,
          type: toType,
        },
        label: buildActivityLabel(type, fromName, toName),
      };
    });
  }

  async listEmployees(filters: EmployeeFilters = {}): Promise<Employee[]> {
    const result = await runRead(
      listEmployees,
      {
        query: filters.query ?? null,
        department: filters.department ?? null,
        teamId: filters.teamId ?? null,
        skillId: filters.skillId ?? null,
        technologyId: filters.technologyId ?? null,
      },
      this.db(),
    );
    return result.records.map(recordToEmployee);
  }

  async getEmployee(id: string): Promise<Employee | null> {
    const result = await runRead(getEmployee, { id }, this.db());
    return result.records[0] ? recordToEmployee(result.records[0]) : null;
  }

  async listTeams(): Promise<Team[]> {
    const result = await runRead(listTeams, {}, this.db());
    return result.records.map(recordToTeam);
  }

  async getTeam(id: string): Promise<Team | null> {
    const result = await runRead(getTeam, { id }, this.db());
    return result.records[0] ? recordToTeam(result.records[0]) : null;
  }

  async listProjects(filters: ProjectFilters = {}): Promise<Project[]> {
    const result = await runRead(
      listProjects,
      {
        query: filters.query ?? null,
        status: filters.status ?? null,
        clientId: filters.clientId ?? null,
        technologyId: filters.technologyId ?? null,
      },
      this.db(),
    );
    return result.records.map(recordToProject);
  }

  async getProject(id: string): Promise<Project | null> {
    const result = await runRead(getProject, { id }, this.db());
    return result.records[0] ? recordToProject(result.records[0]) : null;
  }

  async listSkills(query?: string): Promise<Skill[]> {
    const result = await runRead(listSkills, { query: query ?? null }, this.db());
    return result.records.map(recordToSkill);
  }

  async getSkill(id: string): Promise<Skill | null> {
    const result = await runRead(getSkill, { id }, this.db());
    return result.records[0] ? recordToSkill(result.records[0]) : null;
  }

  async listTechnologies(query?: string): Promise<Technology[]> {
    const result = await runRead(listTechnologies, { query: query ?? null }, this.db());
    return result.records.map(recordToTechnology);
  }

  async getTechnology(id: string): Promise<Technology | null> {
    const result = await runRead(getTechnology, { id }, this.db());
    return result.records[0] ? recordToTechnology(result.records[0]) : null;
  }

  async listClients(query?: string): Promise<Client[]> {
    const result = await runRead(listClients, { query: query ?? null }, this.db());
    return result.records.map(recordToClient);
  }

  async getClient(id: string): Promise<Client | null> {
    const result = await runRead(getClient, { id }, this.db());
    return result.records[0] ? recordToClient(result.records[0]) : null;
  }

  async listCertifications(): Promise<Certification[]> {
    const result = await runRead(listCertifications, {}, this.db());
    return result.records.map(recordToCertification);
  }

  async getRelationships(ref: EntityRef): Promise<Relationship[]> {
    const capitalizedType = ref.type.charAt(0).toUpperCase() + ref.type.slice(1);
    const result = await runRead(
      relationshipsFor,
      { id: ref.id, entityType: capitalizedType },
      this.db(),
    );
    return result.records.map(recordToRelationship);
  }

  async getGraph(options: GraphOptions = {}): Promise<GraphSnapshot> {
    const types = options.types?.length ? options.types : DEFAULT_GRAPH_TYPES;
    const dbTypes = types.map((t) => t.charAt(0).toUpperCase() + t.slice(1));
    const limit = options.limit ?? 34;

    const nodesResult = await runRead(
      graphNodes,
      { types: dbTypes, query: options.query ?? null, limit },
      this.db(),
    );
    const nodes = nodesResult.records.map(recordToGraphNode);

    const ids = nodes.map((n) => n.id);
    const edgesResult = ids.length
      ? await runRead(graphEdges, { ids, limit: 90 }, this.db())
      : { records: [] as never[] };
    const edges = edgesResult.records.map(recordToGraphEdge);

    return computeRadialLayout(nodes, edges);
  }

  async getInsights(): Promise<InsightCard[]> {
    const [
      mostConnected,
      mostMentorRec,
      topTechnologyRec,
      rareSkillsRec,
      riskyProjectsRec,
      mostCollaborativeTeamRec,
      knowledgeSpreadRec,
    ] = await Promise.all([
      runRead(mostConnectedEmployee, {}, this.db()),
      runRead(mostMentor, {}, this.db()),
      runRead(topTechnology, {}, this.db()),
      runRead(rareSkills, {}, this.db()),
      runRead(riskyProjects, {}, this.db()),
      runRead(mostCollaborativeTeam, {}, this.db()),
      runRead(knowledgeSpread, {}, this.db()),
    ]);

    return composeInsights({
      mostConnected: mostConnected.records,
      mostMentor: mostMentorRec.records,
      topTechnology: topTechnologyRec.records,
      rareSkills: rareSkillsRec.records,
      riskyProjects: riskyProjectsRec.records,
      mostCollaborativeTeam: mostCollaborativeTeamRec.records,
      knowledgeSpread: knowledgeSpreadRec.records,
    });
  }

  async search(query: string): Promise<SearchResult[]> {
    const dbTypes = SEARCHABLE_TYPES.map((t) => t.charAt(0).toUpperCase() + t.slice(1));
    const result = await runRead(
      searchNodes,
      { query: query ?? null, types: dbTypes, limit: 25 },
      this.db(),
    );
    return result.records.map(recordToSearchResult);
  }

}