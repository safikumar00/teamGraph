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

/**
 * The repository contract the frontend already consumes (src/data/repository.ts).
 *
 * The backend implements this interface against CognoDB so the UI can swap
 * repositories without changing a single component or hook. This is the one
 * seam between the two layers — do not add UI-specific methods here.
 */
export interface GraphRepository {
  getStats(): Promise<OrgStats>;
  getActivity(): Promise<ActivityEvent[]>;

  listEmployees(filters?: EmployeeFilters): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | null>;

  listTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | null>;

  listProjects(filters?: ProjectFilters): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;

  listSkills(query?: string): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | null>;

  listTechnologies(query?: string): Promise<Technology[]>;
  getTechnology(id: string): Promise<Technology | null>;

  listClients(query?: string): Promise<Client[]>;
  getClient(id: string): Promise<Client | null>;

  listCertifications(): Promise<Certification[]>;

  getRelationships(ref: EntityRef): Promise<Relationship[]>;
  getGraph(options?: GraphOptions): Promise<GraphSnapshot>;
  getInsights(): Promise<InsightCard[]>;
  search(query: string): Promise<SearchResult[]>;
}

/**
 * Marker for the mock implementation the frontend ships with today. Keeping
 * this name here lets the swap line read as
 * `export const repository = cognodbGraphRepository` later.
 */
export const REPOSITORY_IMPLEMENTATION = "cognodb" as const;