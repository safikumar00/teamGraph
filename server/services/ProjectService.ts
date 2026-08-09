import type { GraphRepository } from "../repositories";
import type { ProjectFilters } from "../types";
import type { Project, Relationship } from "../dto";

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