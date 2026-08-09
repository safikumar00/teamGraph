import { closeDriver, initDriver, loadConfig } from "../cognodb";
import { CognoGraphRepository } from "../repositories/CognoGraphRepository";

async function main(): Promise<void> {
  const config = loadConfig();
  initDriver(config);

  console.log(`[test-repo] Instantiating CognoGraphRepository for database "${config.database}"...`);
  const repo = new CognoGraphRepository(config);

  console.log("\n==================================================");
  console.log("             REPOSITORY VERIFICATION              ");
  console.log("==================================================\n");

  try {
    // 1. listEmployees()
    console.log("1. listEmployees():");
    const employees = await repo.listEmployees();
    console.log(`  - Success: Returned ${employees.length} employees.`);
    console.log(`  - Sample Employee DTO:`, JSON.stringify(employees[0], null, 2));

    // 2. getEmployee()
    console.log("\n2. getEmployee('E1'):");
    const employee = await repo.getEmployee("E1");
    console.log(`  - Success: Found Employee "${employee?.name}" (${employee?.role}).`);
    const nonexistentEmployee = await repo.getEmployee("nonexistent_id");
    console.log(`  - Success (empty check): getEmployee('nonexistent_id') returned: ${nonexistentEmployee}`);

    // 3. listProjects()
    console.log("\n3. listProjects():");
    const projects = await repo.listProjects();
    console.log(`  - Success: Returned ${projects.length} projects.`);
    console.log(`  - Sample Project DTO:`, JSON.stringify(projects[0], null, 2));

    // 4. getProject()
    console.log("\n4. getProject('P1'):");
    const project = await repo.getProject("P1");
    console.log(`  - Success: Found Project "${project?.name}" (${project?.code}).`);

    // 5. listTeams()
    console.log("\n5. listTeams():");
    const teams = await repo.listTeams();
    console.log(`  - Success: Returned ${teams.length} teams.`);
    console.log(`  - Sample Team DTO:`, JSON.stringify(teams[0], null, 2));

    // 6. getTeam()
    console.log("\n6. getTeam('TM1'):");
    const team = await repo.getTeam("TM1");
    console.log(`  - Success: Found Team "${team?.name}" (Department: ${team?.department}).`);

    // 7. listSkills()
    console.log("\n7. listSkills():");
    const skills = await repo.listSkills();
    console.log(`  - Success: Returned ${skills.length} skills.`);
    console.log(`  - Sample Skill DTO:`, JSON.stringify(skills[0], null, 2));

    // 8. getSkill()
    console.log("\n8. getSkill('S5'):");
    const skill = await repo.getSkill("S5");
    console.log(`  - Success: Found Skill "${skill?.name}" (Category: ${skill?.category}).`);

    // 9. listTechnologies()
    console.log("\n9. listTechnologies():");
    const technologies = await repo.listTechnologies();
    console.log(`  - Success: Returned ${technologies.length} technologies.`);
    console.log(`  - Sample Technology DTO:`, JSON.stringify(technologies[0], null, 2));

    // 10. getTechnology()
    console.log("\n10. getTechnology('T5'):");
    const tech = await repo.getTechnology("T5");
    console.log(`  - Success: Found Technology "${tech?.name}" (Category: ${tech?.category}).`);

    // 11. listClients()
    console.log("\n11. listClients():");
    const clients = await repo.listClients();
    console.log(`  - Success: Returned ${clients.length} clients.`);
    console.log(`  - Sample Client DTO:`, JSON.stringify(clients[0], null, 2));

    // 12. getClient()
    console.log("\n12. getClient('C6'):");
    const client = await repo.getClient("C6");
    console.log(`  - Success: Found Client "${client?.name}" (Industry: ${client?.industry}).`);

    // 13. getGraph()
    console.log("\n13. getGraph():");
    const graph = await repo.getGraph({ limit: 40 });
    console.log(`  - Success: Returned ${graph.nodes.length} nodes and ${graph.edges.length} edges.`);
    const sampleNode = graph.nodes[0];
    console.log(`  - Node type verification: "${sampleNode.label}" (x: ${sampleNode.x?.toFixed(2)}, y: ${sampleNode.y?.toFixed(2)})`);
    console.log(`  - Sample Edge DTO:`, JSON.stringify(graph.edges[0], null, 2));

    // 14. getStats()
    console.log("\n14. getStats():");
    const stats = await repo.getStats();
    console.log(`  - Success: Stats successfully retrieved.`);
    console.log(`  - Employee count: ${stats.employees} (Expected: 45)`);
    console.log(`  - Team count: ${stats.teams} (Expected: 8)`);
    console.log(`  - Project count: ${stats.projects} (Expected: 16)`);
    console.log(`  - Skill count: ${stats.skills} (Expected: 24)`);
    console.log(`  - Technology count: ${stats.technologies} (Expected: 14)`);
    console.log(`  - Client count: ${stats.clients} (Expected: 7)`);
    console.log(`  - Relationship count: ${stats.relationships} (Expected: 512)`);
    
    // Assert all stats values
    const ok = 
      stats.employees === 45 &&
      stats.teams === 8 &&
      stats.projects === 16 &&
      stats.skills === 24 &&
      stats.technologies === 14 &&
      stats.clients === 7 &&
      stats.relationships === 512;
    console.log(ok ? "  ✓ ALL STATS COUNTS MATCH CANONICAL EXPECTATIONS!" : "  ✗ COUNT MISMATCH DETECTED!");

    // 15. getInsights()
    console.log("\n15. getInsights():");
    const insights = await repo.getInsights();
    console.log(`  - Success: Returned ${insights.length} insight cards.`);
    insights.forEach(card => {
      console.log(`    * [${card.severity}] "${card.title}" — Headline: "${card.headline}" (Metric: ${card.metric})`);
    });

    // 16. search()
    console.log("\n16. search('Sunil'):");
    const searchRes = await repo.search("Sunil");
    console.log(`  - Success: Search returned ${searchRes.length} results.`);
    searchRes.forEach(r => {
      console.log(`    * [${r.type}] Match: "${r.title}" (ID: ${r.id})`);
    });

  } catch (error) {
    console.error("✗ Verification test failed with error:", error);
  } finally {
    await closeDriver();
    console.log("\n==================================================");
    console.log("            VERIFICATION TEST FINISHED            ");
    console.log("==================================================");
  }
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
