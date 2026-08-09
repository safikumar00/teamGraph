import { runWrite, type CognodbConfig } from "../cognodb/index.js";

/**
 * TeamGraph CognoDB schema (Phase 2).
 *
 * This module owns the graph *schema*: uniqueness constraints on stable node
 * IDs and lookup indexes on fields the frontend/query layer searches by. It
 * does NOT generate application data (Phase 3) and does NOT define business
 * queries. Every statement is idempotent (`IF NOT EXISTS`) so the bootstrap can
 * be run any number of times.
 *
 * The driver/session architecture is reused as-is — `runWrite` opens a write
 * session, executes, and closes it, normalising errors to the typed hierarchy.
 */

export interface SeedStep {
  name: string;
  cypher: string;
  params?: Record<string, unknown>;
}

/** Bumped when the schema shape changes so migrations can detect drift. */
export const SCHEMA_VERSION = 2;

/**
 * Canonical node labels. No additional node types are introduced.
 * (The query layer also references an `Activity` node from the foundation
 * phase; it is deliberately excluded from the canonical schema pending a
 * later decision and is not created here.)
 */
export const NODE_LABELS = [
  "Employee",
  "Team",
  "Project",
  "Skill",
  "Technology",
  "Certification",
  "Client",
] as const;

/**
 * Canonical relationship model — the 11 relationship types the graph
 * supports, with their endpoint labels. Neo4j has no DDL to "declare" a
 * relationship type (types materialise on first edge insert), so this constant
 * documents the contract and is available for future validation tooling.
 */
export interface RelationshipSpec {
  from: string;
  type: string;
  to: string;
}

export const RELATIONSHIP_MODEL: RelationshipSpec[] = [
  { from: "Employee", type: "WORKS_IN", to: "Team" },
  { from: "Employee", type: "WORKED_ON", to: "Project" },
  { from: "Employee", type: "HAS_SKILL", to: "Skill" },
  { from: "Employee", type: "USES_TECHNOLOGY", to: "Technology" },
  { from: "Employee", type: "REPORTS_TO", to: "Employee" },
  { from: "Employee", type: "MENTORED", to: "Employee" },
  { from: "Employee", type: "CERTIFIED_IN", to: "Certification" },
  { from: "Project", type: "FOR_CLIENT", to: "Client" },
  { from: "Project", type: "USES", to: "Technology" },
  { from: "Project", type: "REQUIRES_SKILL", to: "Skill" },
  { from: "Project", type: "DEPENDS_ON", to: "Project" },
];

/**
 * Uniqueness constraints on stable node IDs — one per label.
 * These also back point lookups (`getEmployee`, `getProject`, …).
 */
const CONSTRAINT_STEPS: SeedStep[] = NODE_LABELS.map((label) => {
  const key = label.toLowerCase();
  return {
    name: `constraint:${key}.id`,
    cypher: `CREATE CONSTRAINT ${key}_id_unique IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE`,
  };
});

/**
 * Lookup indexes on fields the frontend and query layer filter/sort/search by.
 * No separate `id` index is created — the uniqueness constraint already
 * provides one. Low-cardinality fields (status, risk, department, …) are still
 * indexed because the query layer filters them by equality.
 */
const INDEX_STEPS: SeedStep[] = [
  // Employee — searched/filtered by name, department, role, location.
  { name: "index:employee.name", cypher: "CREATE INDEX employee_name_index IF NOT EXISTS FOR (n:Employee) ON (n.name)" },
  { name: "index:employee.department", cypher: "CREATE INDEX employee_department_index IF NOT EXISTS FOR (n:Employee) ON (n.department)" },
  { name: "index:employee.role", cypher: "CREATE INDEX employee_role_index IF NOT EXISTS FOR (n:Employee) ON (n.role)" },
  { name: "index:employee.location", cypher: "CREATE INDEX employee_location_index IF NOT EXISTS FOR (n:Employee) ON (n.location)" },
  // Team — searched by name.
  { name: "index:team.name", cypher: "CREATE INDEX team_name_index IF NOT EXISTS FOR (n:Team) ON (n.name)" },
  // Project — searched by name/code; filtered by status; insights filter by risk.
  { name: "index:project.name", cypher: "CREATE INDEX project_name_index IF NOT EXISTS FOR (n:Project) ON (n.name)" },
  { name: "index:project.code", cypher: "CREATE INDEX project_code_index IF NOT EXISTS FOR (n:Project) ON (n.code)" },
  { name: "index:project.status", cypher: "CREATE INDEX project_status_index IF NOT EXISTS FOR (n:Project) ON (n.status)" },
  { name: "index:project.risk", cypher: "CREATE INDEX project_risk_index IF NOT EXISTS FOR (n:Project) ON (n.risk)" },
  // Skill — searched/filtered by name, category.
  { name: "index:skill.name", cypher: "CREATE INDEX skill_name_index IF NOT EXISTS FOR (n:Skill) ON (n.name)" },
  { name: "index:skill.category", cypher: "CREATE INDEX skill_category_index IF NOT EXISTS FOR (n:Skill) ON (n.category)" },
  // Technology — searched/filtered by name, category; insights sort by adoption.
  { name: "index:technology.name", cypher: "CREATE INDEX technology_name_index IF NOT EXISTS FOR (n:Technology) ON (n.name)" },
  { name: "index:technology.category", cypher: "CREATE INDEX technology_category_index IF NOT EXISTS FOR (n:Technology) ON (n.category)" },
  { name: "index:technology.adoption", cypher: "CREATE INDEX technology_adoption_index IF NOT EXISTS FOR (n:Technology) ON (n.adoption)" },
  // Certification — searched/listed by name.
  { name: "index:certification.name", cypher: "CREATE INDEX certification_name_index IF NOT EXISTS FOR (n:Certification) ON (n.name)" },
  // Client — searched/filtered by name, industry, region.
  { name: "index:client.name", cypher: "CREATE INDEX client_name_index IF NOT EXISTS FOR (n:Client) ON (n.name)" },
  { name: "index:client.industry", cypher: "CREATE INDEX client_industry_index IF NOT EXISTS FOR (n:Client) ON (n.industry)" },
  { name: "index:client.region", cypher: "CREATE INDEX client_region_index IF NOT EXISTS FOR (n:Client) ON (n.region)" },
];

/** Full ordered schema: constraints first, then indexes. */
const SCHEMA_STEPS: SeedStep[] = [...CONSTRAINT_STEPS, ...INDEX_STEPS];

/** Returns the schema step list for inspection/testing without executing. */
export function getSchemaSteps(): readonly SeedStep[] {
  return SCHEMA_STEPS;
}

import { buildDataSeedSteps } from "./data.js";

/**
 * Data seed steps. Phase 3 populates this with the realistic company graph.
 * The runner below is already wired to apply them.
 */
export const DATA_SEED_STEPS: SeedStep[] = buildDataSeedSteps();

export interface SeedResult {
  step: string;
  ok: boolean;
  error?: string;
}

export class SeedRunner {
  constructor(private readonly config: CognodbConfig) {}

  private db(): string | undefined {
    return this.config.database || undefined;
  }

  /** Creates all constraints + indexes. Idempotent; safe to run repeatedly. */
  async ensureSchema(): Promise<SeedResult[]> {
    return this.run(SCHEMA_STEPS);
  }

  /**
   * Removes all nodes + relationships. Destructive — guarded by an explicit
   * confirmation string so it can never be triggered accidentally.
   */
  async purge(confirm: "DELETE EVERYTHING"): Promise<SeedResult[]> {
    if (confirm !== "DELETE EVERYTHING") {
      throw new Error("purge() requires the literal confirmation 'DELETE EVERYTHING'.");
    }
    return this.run([{ name: "purge", cypher: "MATCH (n) DETACH DELETE n" }]);
  }

  /** Applies the data seed steps (no-op until DATA_SEED_STEPS is populated). */
  async seedData(): Promise<SeedResult[]> {
    return this.run(DATA_SEED_STEPS);
  }

  /** Runs an arbitrary list of seed steps sequentially, reporting each. */
  async run(steps: SeedStep[]): Promise<SeedResult[]> {
    const results: SeedResult[] = [];
    for (const step of steps) {
      try {
        await runWrite(step.cypher, step.params ?? {}, this.db());
        results.push({ step: step.name, ok: true });
      } catch (error) {
        results.push({
          step: step.name,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
        // Fail fast: schema integrity matters more than partial progress.
        break;
      }
    }
    return results;
  }
}