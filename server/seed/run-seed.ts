import { closeDriver, initDriver, loadConfig, runRead } from "../cognodb/index.js";
import { SeedRunner } from "./index.js";

async function main(): Promise<void> {
  const config = loadConfig();
  initDriver(config);

  console.log(`[seed] Starting idempotent database seed against "${config.database}"...`);

  const runner = new SeedRunner(config);
  const results = await runner.seedData();

  let failed = 0;
  let success = 0;
  for (const r of results) {
    if (r.ok) {
      success += 1;
    } else {
      failed += 1;
      console.error(`  ✗ ${r.step}: ${r.error}`);
    }
  }

  if (failed > 0) {
    console.error(`[seed] Seeding FAILED — ${failed} step(s) errored.`);
    await closeDriver();
    process.exit(1);
  }

  console.log(`[seed] Seeding completed: ${success} steps applied successfully.`);

  // --- Verification queries ---
  console.log("\n[verification] Running database audits...");

  // 1. Total Nodes
  const nodeCountRes = await runRead("MATCH (n) RETURN count(n) AS count");
  const totalNodes = nodeCountRes.records[0].get("count").toNumber();
  console.log(`Total Nodes: ${totalNodes}`);

  // 2. Nodes by Label
  const labelCountsRes = await runRead("MATCH (n) RETURN labels(n)[0] AS label, count(n) AS count ORDER BY label");
  console.log("\nNodes by Label:");
  for (const r of labelCountsRes.records) {
    console.log(`  - ${r.get("label")}: ${r.get("count").toNumber()}`);
  }

  // 3. Total Relationships
  const relCountRes = await runRead("MATCH ()-[r]->() RETURN count(r) AS count");
  const totalRels = relCountRes.records[0].get("count").toNumber();
  console.log(`\nTotal Relationships: ${totalRels}`);

  // 4. Relationships by Type
  const typeCountsRes = await runRead("MATCH ()-[r]->() RETURN type(r) AS type, count(r) AS count ORDER BY type");
  console.log("\nRelationships by Type:");
  for (const r of typeCountsRes.records) {
    console.log(`  - ${r.get("type")}: ${r.get("count").toNumber()}`);
  }

  // 5. Representative Graph Traversal Queries
  console.log("\n[verification] Running representative graph queries...");

  // Query A: "Who are Zendaya Coleman's (E10) collaborators?"
  console.log("\nQuery A: Zendaya Coleman's (E10) Collaborators (derived via shared projects):");
  const queryARes = await runRead(`
    MATCH (e:Employee {id: 'E10'})-[:WORKED_ON]->(p:Project)<-[:WORKED_ON]-(collab:Employee)
    WHERE collab <> e
    RETURN DISTINCT collab.name AS name, collab.role AS role, p.name AS project
    ORDER BY name
  `);
  for (const r of queryARes.records) {
    console.log(`  - ${r.get("name")} (${r.get("role")}) via ${r.get("project")}`);
  }

  // Query B: "Which technologies connect the most projects?"
  console.log("\nQuery B: Technologies shared by the most projects:");
  const queryBRes = await runRead(`
    MATCH (tech:Technology)<-[:USES]-(p:Project)
    RETURN tech.name AS tech, count(p) AS projectCount
    ORDER BY projectCount DESC, tech
    LIMIT 5
  `);
  for (const r of queryBRes.records) {
    console.log(`  - ${r.get("tech")}: used in ${r.get("projectCount").toNumber()} projects`);
  }

  // Query C: "Find employees with rare skills (Critical/Rare):"
  console.log("\nQuery C: Employees with rare or critical skills:");
  const queryCRes = await runRead(`
    MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
    WHERE s.rarity IN ['Rare', 'Critical']
    RETURN s.name AS skill, s.rarity AS rarity, collect(e.name) AS holders
    ORDER BY rarity, skill
  `);
  for (const r of queryCRes.records) {
    const holdersList = r.get("holders").join(", ");
    console.log(`  - ${r.get("skill")} (${r.get("rarity")}): held by [${holdersList}]`);
  }

  await closeDriver();
  console.log("\n[seed] Verification complete.");
}

main().catch((err) => {
  console.error("[seed] fatal:", err);
  process.exit(1);
});
