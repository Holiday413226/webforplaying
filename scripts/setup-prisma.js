// Vercel 部署时自动切换到 PostgreSQL Schema
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const pgSchemaPath = path.join(__dirname, "..", "prisma", "schema.pg.prisma");

// 检查 DATABASE_URL 是否是 PostgreSQL
const dbUrl = process.env.DATABASE_URL || "";

if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
  console.log("[setup-prisma] Detected PostgreSQL, switching schema...");
  fs.copyFileSync(pgSchemaPath, schemaPath);
}

console.log("[setup-prisma] Running prisma generate...");
const prismaBin = path.join(__dirname, "..", "node_modules", ".bin", "prisma");
execSync(`"${prismaBin}" generate`, { stdio: "inherit" });
console.log("[setup-prisma] Done!");