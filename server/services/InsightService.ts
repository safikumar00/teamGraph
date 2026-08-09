import type { GraphRepository } from "../repositories";
import type { InsightCard } from "../dto";

/**
 * Insights surface. Composition of insight cards lives in the mapper composer;
 * this service only orchestrates the repository call so additional insight
 * endpoints (e.g. filtered by department) can be added without touching data access.
 */
export class InsightService {
  constructor(private readonly repo: GraphRepository) {}

  getInsights(): Promise<InsightCard[]> {
    return this.repo.getInsights();
  }
}