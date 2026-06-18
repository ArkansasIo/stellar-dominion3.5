import { spawn } from "node:child_process";
import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as net from "node:net";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const projectRoot = resolve(currentDir, "..");

// Always resolve .env relative to the nested project root, then fallback to cwd.
config({ path: resolve(projectRoot, ".env") });
config();

// Manually set DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
  const neonUrl = "postgresql://neondb_owner:npg_roX60HeYZbxW@ep-bitter-cloud-ad1d57rw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  process.env.DATABASE_URL = neonUrl;
  console.log("Set DATABASE_URL from hardcoded value");
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0);
const nodeEnv = process.env.NODE_ENV ?? "development";

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolvePort) => {
    const server = net.createServer();
    server.once("error", () => resolvePort(false));
    server.once("listening", () => {
      server.close(() => resolvePort(true));
    });
    server.listen(port, "0.0.0.0");
  });
}

async function findAvailablePort(startPort: number, maxChecks = 25): Promise<number> {
  for (let offset = 0; offset < maxChecks; offset += 1) {
    const candidate = startPort + offset;
    const free = await isPortFree(candidate);
    if (free) return candidate;
  }
  return startPort;
}

const preferredPort = Number.parseInt(process.env.PORT || "5001", 10);
const basePort = Number.isFinite(preferredPort) && preferredPort > 0 ? preferredPort : 5001;

async function startDev() {
  const selectedPort = await findAvailablePort(basePort);
  if (selectedPort !== basePort) {
    console.warn(`Port ${basePort} is already in use. Falling back to port ${selectedPort}.`);
  }

  const command = hasDatabaseUrl
    ? "tsx server/index.ts"
    : `npx vite dev --port ${selectedPort}`;

  if (hasDatabaseUrl) {
    console.log("Starting full-stack development server...");
  } else {
    console.log("DATABASE_URL not found. Starting client-only dev server.");
    console.log("Set DATABASE_URL to run backend + API routes.");
  }

  const child = spawn(command, {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: nodeEnv,
      PORT: String(selectedPort),
      DATABASE_URL: process.env.DATABASE_URL || "",
    },
  });

  child.on("exit", (code: number | null) => {
    process.exit(code ?? 0);
  });

  child.on("error", (error: Error) => {
    console.error("Failed to start development process:", error);
    process.exit(1);
  });
}

startDev().catch((error) => {
  console.error("Failed to initialize development server:", error);
  process.exit(1);
});
