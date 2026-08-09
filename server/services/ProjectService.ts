import type { GraphRepository } from "../repositories/index.js";
import type { ProjectFilters } from "../types.js";
import type { Project, Relationship } from "../dto/index.js";

/** Project surface: list, detail, dependencies, and project relationships. */
export class ProjectService {
  constructor(private readonly repo: GraphRepository) {}

  list(filters: ProjectFilters = {}): Promise<Project[]> {
    return this.repo.listProjects(filters);
  }

  get(id: string): Promise<Project | null> {
    return this.repo.getProject(id);
  }

  relationships(id: string): Promise<Relationship[]> {
    return this.repo.getRelationships({ type: "project", id });
  }
}