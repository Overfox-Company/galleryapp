import { spawnSync } from "node:child_process";
import { closeSync, mkdirSync, openSync } from "node:fs";
import path from "node:path";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const sqlitePath = databaseUrl.startsWith("file:")
  ? databaseUrl.slice("file:".length)
  : databaseUrl;
const resolvedPath = path.isAbsolute(sqlitePath)
  ? sqlitePath
  : path.join(process.cwd(), sqlitePath);

mkdirSync(path.dirname(resolvedPath), { recursive: true });
const database = openSync(resolvedPath, "a");
closeSync(database);

const prismaBinary = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "prisma.cmd" : "prisma",
);

const migration =
  process.platform === "win32"
    ? spawnSync("cmd.exe", ["/d", "/s", "/c", `${prismaBinary} migrate deploy`], {
        stdio: "inherit",
      })
    : spawnSync(prismaBinary, ["migrate", "deploy"], {
        stdio: "inherit",
      });

if (migration.error) {
  console.error(migration.error.message);
  process.exit(1);
}

if (migration.status !== 0) process.exit(migration.status ?? 1);
