import type {
  ActivityEvent,
  Certification,
  Client,
  Employee,
  EntityType,
  GraphSnapshot,
  InsightCard,
  OrgStats,
  Project,
  Relationship,
  SearchResult,
  Skill,
  Team,
  Technology,
} from "./types";

export interface EmployeeFilters {
  query?: string;
  department?: string;
  teamId?: string;
  skillId?: string;
  technologyId?: string;
}

export interface ProjectFilters {
  query?: string;
  status?: string;
  clientId?: string;
  technologyId?: string;
}

export interface GraphOptions {
  types?: EntityType[];
  query?: string;
  focusId?: string;
  limit?: number;
}

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

  getRelationships(ref: { type: EntityType; id: string }): Promise<Relationship[]>;
  getGraph(options?: GraphOptions): Promise<GraphSnapshot>;
  getInsights(): Promise<InsightCard[]>;
  search(query: string): Promise<SearchResult[]>;
}

// Client-safe helper to perform HTTP JSON fetches
async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const repository: GraphRepository = {
  getStats() {
    return jsonFetch<OrgStats>("/api/stats");
  },

  getActivity() {
    return jsonFetch<ActivityEvent[]>("/api/activity");
  },

  listEmployees(filters = {}) {
    return jsonFetch<Employee[]>("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });
  },

  async getEmployee(id) {
    try {
      return await jsonFetch<Employee>(`/api/employees/${id}`);
    } catch (e) {
      return null;
    }
  },

  listTeams() {
    return jsonFetch<Team[]>("/api/teams");
  },

  async getTeam(id) {
    try {
      return await jsonFetch<Team>(`/api/teams/${id}`);
    } catch (e) {
      return null;
    }
  },

  listProjects(filters = {}) {
    return jsonFetch<Project[]>("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });
  },

  async getProject(id) {
    try {
      return await jsonFetch<Project>(`/api/projects/${id}`);
    } catch (e) {
      return null;
    }
  },

  listSkills(query) {
    const url = query ? `/api/skills?query=${encodeURIComponent(query)}` : "/api/skills";
    return jsonFetch<Skill[]>(url);
  },

  async getSkill(id) {
    try {
      return await jsonFetch<Skill>(`/api/skills/${id}`);
    } catch (e) {
      return null;
    }
  },

  listTechnologies(query) {
    const url = query ? `/api/technologies?query=${encodeURIComponent(query)}` : "/api/technologies";
    return jsonFetch<Technology[]>(url);
  },

  async getTechnology(id) {
    try {
      return await jsonFetch<Technology>(`/api/technologies/${id}`);
    } catch (e) {
      return null;
    }
  },

  listClients(query) {
    const url = query ? `/api/clients?query=${encodeURIComponent(query)}` : "/api/clients";
    return jsonFetch<Client[]>(url);
  },

  async getClient(id) {
    try {
      return await jsonFetch<Client>(`/api/clients/${id}`);
    } catch (e) {
      return null;
    }
  },

  listCertifications() {
    return jsonFetch<Certification[]>("/api/certifications");
  },

  getRelationships(ref) {
    return jsonFetch<Relationship[]>("/api/relationships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ref),
    });
  },

  getGraph(options = {}) {
    return jsonFetch<GraphSnapshot>("/api/graph", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });
  },

  getInsights() {
    return jsonFetch<InsightCard[]>("/api/insights");
  },

  search(query) {
    return jsonFetch<SearchResult[]>(`/api/search?query=${encodeURIComponent(query)}`);
  },
};
