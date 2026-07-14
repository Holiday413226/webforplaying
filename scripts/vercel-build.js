// Vercel build script: switch to PostgreSQL schema and build
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const pgSchemaPath = path.join(__dirname, "..", "prisma", "schema.pg.prisma");

console.log("[vercel-build] Current schema content (first 100 chars):");
console.log(fs.readFileSync(schemaPath, "utf-8").substring(0, 100));

console.log("[vercel-build] Switching to PostgreSQL schema...");
fs.copyFileSync(pgSchemaPath, schemaPath);

console.log("[vercel-build] New schema content (first 100 chars):");
console.log(fs.readFileSync(schemaPath, "utf-8").substring(0, 100));

console.log("[vercel-build] Generating Prisma client...");
try {
  execSync("prisma generate", { stdio: "pipe" });
  console.log("[vercel-build] Prisma generate succeeded!");
} catch (e) {
  console.error("[vercel-build] stdout:", e.stdout?.toString());
  console.error("[vercel-build] stderr:", e.stderr?.toString());
  console.error("[vercel-build] Error:", e.message);
  throw e;
}

console.log("[vercel-build] Building Next.js...");
execSync("next build", { stdio: "inherit" });