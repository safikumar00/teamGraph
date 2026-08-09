import type { GraphRepository } from "../repositories";
import type { Relationship, Team } from "../dto";

/** Team surface: list, detail, and a team's collaboration relationships. */
export class TeamService {
  constructor(private readonly repo: GraphRepository) {}

  list(): Promise<Team[]> {
    return this.repo.listTeams();
  }

  get(id: string): Promise<Team | null> {
    return this.repo.getTeam(id);
  }

  relationships(id: string): Promise<Relationship[]> {
    return this.repo.getRelationships({ type: "team", id });
  }
}