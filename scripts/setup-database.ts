import { spawnSync } from "node:child_process";
import { closeSync, openSync } from "node:fs";
import path from "node:path";

const database = openSync(path.join(process.cwd(), "dev.db"), "a");
closeSync(database);

const migration = spawnSync("pnpm", ["exec", "prisma", "migrate", "deploy"], {
  stdio: "inherit",
});

if (migration.status !== 0) process.exit(migration.status ?? 1);
