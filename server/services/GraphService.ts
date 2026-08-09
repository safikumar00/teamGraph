import type { GraphRepository } from "../repositories/index.js";
import type { EntityRef, GraphOptions } from "../types.js";
import type { GraphSnapshot, Relationship, SearchResult } from "../dto/index.js";

/**
 * Graph Explorer service. Thin orchestration over the repository contract —
 * the heavy lifting (query + layout) already lives in the repository so the
 * frontend swap stays zero-change. Enrichment for future API endpoints goes here.
 */
export class GraphService {
  constructor(private readonly repo: GraphRepository) {}

  getExplorerSnapshot(options: GraphOptions = {}): Promise<GraphSnapshot> {
    return this.repo.getGraph(options);
  }

  getRelationships(ref: EntityRef): Promise<Relationship[]> {
    return this.repo.getRelationships(ref);
  }

  search(query: string): Promise<SearchResult[]> {
    return this.repo.search(query);
  }
}