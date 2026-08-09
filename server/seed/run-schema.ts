import { closeDriver, initDriver, loadConfig } from "../cognodb/index.js";
import { getSchemaSteps, SeedRunner } from "./index.js";

/**
 * Standalone schema bootstrap entrypoint.
 *
 * Loads config from the environment, initialises the singleton driver, applies
 * the full idempotent schema (constraints + indexes), prints the result of
 * each step, and shuts the driver pool down. Exits non-zero on any failure so
 * it can be wired into CI/migration gates.
 *
 * Run with a TypeScript loader, e.g.:
 *   npx tsx server/seed/run-schema.ts
 */
async function main(): Promise<void> {
  const config = loadConfig();
  initDriver(config);

  const steps = getSchemaSteps();
  const constraintCount = steps.filter((s) => s.name.startsWith("constraint:")).length;
  const indexCount = steps.length - constraintCount;
  console.log(
    `[schema] v2 — applying ${steps.length} steps ` +
      `(${constraintCount} constraints + ${indexCount} indexes) to database "${config.database}".`,
  );

  const runner = new SeedRunner(config);
  const results = await runner.ensureSchema();

  let failed = 0;
  for (const r of results) {
    if (r.ok) {
      console.log(`  ✓ ${r.step}`);
    } else {
      failed += 1;
      console.error(`  ✗ ${r.step}: ${r.error}`);
    }
  }

  await closeDriver();

  if (failed > 0) {
    console.error(`[schema] bootstrap FAILED — ${failed} step(s) errored.`);
    process.exit(1);
  }
  console.log(`[schema] bootstrap complete — ${results.length}/${steps.length} steps applied.`);
}

void main().catch((err) => {
  console.error("[schema] fatal:", err);
  process.exit(1);
});