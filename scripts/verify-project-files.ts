import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "client/index.html",
  "client/src/main.tsx",
  "client/src/App.tsx",
  "server/index.ts",
  "server/routes.ts",
  "server/db.ts",
  "shared/schema.ts",
  ".github/workflows/ci.yml",
  ".github/workflows/deploy-pages.yml",
];

const missing: string[] = [];
for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) missing.push(file);
}

const serverIndex = readFileSync(path.join(root, "server/index.ts"), "utf8");
const importRegex = /from\s+["'](\.\/[^"']+)["']/g;
const missingServerImports: string[] = [];
let match: RegExpExecArray | null;
while ((match = importRegex.exec(serverIndex))) {
  const specifier = match[1];
  const candidate = path.resolve(root, "server", specifier);
  const candidates = [candidate, `${candidate}.ts`, `${candidate}.tsx`, path.join(candidate, "index.ts")];
  if (!candidates.some(existsSync)) missingServerImports.push(specifier);
}

if (missing.length || missingServerImports.length) {
  console.error("Project file verification failed.");
  if (missing.length) console.error("Missing required files:\n" + missing.map((x) => `- ${x}`).join("\n"));
  if (missingServerImports.length) console.error("Missing server imports:\n" + missingServerImports.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

console.log(`Project file verification passed: ${requiredFiles.length} core files and server import targets are present.`);
