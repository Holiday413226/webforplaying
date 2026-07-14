// Vercel build script: switch to PostgreSQL schema and build
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const pgSchemaPath = path.join(__dirname, "..", "prisma", "schema.pg.prisma");

console.log("[vercel-build] Switching to PostgreSQL schema...");
fs.copyFileSync(pgSchemaPath, schemaPath);

console.log("[vercel-build] Generating Prisma client...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("[vercel-build] Building Next.js...");
execSync("npx next build", { stdio: "inherit" });