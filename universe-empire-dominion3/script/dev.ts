import { spawn } from "node:child_process";
import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as net from "node:net";
import { existsSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { platform } from "node:os";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const projectRoot = resolve(currentDir, "..");

config({ path: resolve(projectRoot, ".env") });
config();

const isWin = platform() === "win32";

const preferredPort = Number.parseInt(process.env.PORT || "5000", 10);
const basePort = Number.isFinite(preferredPort) && preferredPort > 0 ? preferredPort : 5000;

const pgDataDir = resolve(projectRoot, ".postgres_data");
const pgLogFile = resolve(pgDataDir, "server.log");
const PG_PORT = 15434;

const PSQL_PATH = isWin ? "C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe" : "psql";
const PG_CTL_PATH = isWin ? "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_ctl.exe" : "pg_ctlcluster";
const PG_ISREADY_PATH = isWin ? "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_isready.exe" : "pg_isready";
const PG_USER = process.env.PG_USER || process.env.USER || (isWin ? "Shadow" : "postgres");

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

async function isPgReady(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const args = isWin
      ? ["-h", "localhost", "-p", String(PG_PORT)]
      : ["-h", "localhost", "-p", String(PG_PORT)];
    const check = spawn(PG_ISREADY_PATH, args, { stdio: "ignore" });
    check.on("exit", (code) => resolve(code === 0));
  });
}

function ensurePgLockDirectory(): void {
  // PostgreSQL needs /run/postgresql for its lock file
  const lockDir = "/run/postgresql";
  try {
    if (!existsSync(lockDir)) {
      console.log(`🔧 Creating PostgreSQL lock directory: ${lockDir}`);
      mkdirSync(lockDir, { recursive: true, mode: 0o777 });
    }
    // Clean up stale lock files that may prevent startup
    const stalePid = resolve(pgDataDir, "postmaster.pid");
    const staleSocket = resolve(lockDir, ".s.PGSQL.15432.lock");
    for (const f of [stalePid, staleSocket]) {
      if (existsSync(f)) {
        try {
          unlinkSync(f);
        } catch (_) {
          /* ignore */ }
      }
    }
  } catch (e) {
    console.warn(`⚠️  Could not prepare lock directory: ${e}`);
  }
}

async function startLocalPostgres(): Promise<void> {
  const pgReady = await isPgReady(PG_PORT);
  if (pgReady) {
    console.log(`✅ Local PostgreSQL already running on port ${PG_PORT}`);
    return;
  }

  if (isWin) {
    ensurePgLockDirectory();

    if (!existsSync(pgDataDir)) {
      console.log("🔧 Initializing PostgreSQL data directory...");
      const init = spawn(PG_CTL_PATH, ["init", "-D", pgDataDir], { stdio: "inherit" });
      await new Promise((resolve, reject) => {
        init.on("exit", (code) => (code === 0 ? resolve(undefined) : reject(new Error(`pg_ctl init failed: ${code}`))));
      });
    }

    const pgConf = resolve(pgDataDir, "postgresql.conf");
    const pgHba = resolve(pgDataDir, "pg_hba.conf");
    writeFileSync(pgConf, `listen_addresses = 'localhost'\nport = ${PG_PORT}\nmax_connections = 20\nshared_buffers = 64MB\n`);
    writeFileSync(pgHba, "local   all             all                                     trust\nhost    all             all             127.0.0.1/32            trust\nhost    all             all             ::1/128                 trust\n");

    console.log(`🚀 Starting local PostgreSQL on port ${PG_PORT}...`);
    const pgStart = spawn(PG_CTL_PATH, ["start", "-D", pgDataDir, "-l", pgLogFile], {
      stdio: "inherit",
      detached: true,
    });

    await new Promise((resolve, reject) => {
      pgStart.on("exit", (code) => {
        if (code === 0) {
          console.log("✅ PostgreSQL started successfully");
          resolve(undefined);
        } else {
          reject(new Error(`pg_ctl start failed: ${code}`));
        }
      });
    });
  } else {
    // Linux: use system PostgreSQL via pg_ctlcluster
    console.log(`🚀 Starting system PostgreSQL...`);
    const pgStart = spawn("pg_ctlcluster", ["15", "main", "start"], {
      stdio: "inherit",
    });

    await new Promise((resolve, reject) => {
      pgStart.on("exit", (code) => {
        if (code === 0) {
          console.log("✅ PostgreSQL started successfully");
          resolve(undefined);
        } else {
          reject(new Error(`pg_ctlcluster start failed: ${code}`));
        }
      });
    });
  }

  // Wait for PostgreSQL to be ready
  for (let i = 0; i < 15; i++) {
    const ready = await isPgReady(PG_PORT);
    if (ready) {
      console.log("✅ PostgreSQL is ready");
      return;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  throw new Error("PostgreSQL did not become ready in time");
}

async function createDatabaseIfNeeded(): Promise<void> {
  const pgPort = isWin ? PG_PORT : 5432;
  return new Promise((resolve, reject) => {
    const check = spawn(PSQL_PATH, ["-h", "localhost", "-p", String(pgPort), "-U", PG_USER, "-d", "postgres", "-c", "SELECT 1 FROM pg_database WHERE datname = 'stellar_dominion';"], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });
    let output = "";
    check.stdout?.on("data", (d) => (output += d));
    check.stderr?.on("data", (d) => (output += d));
    check.on("exit", () => {
      if (output.includes("1 row") || output.includes("(1 row)")) {
        console.log("✅ Database stellar_dominion exists");
        resolve();
        return;
      }
      console.log("🔧 Creating database stellar_dominion...");
      const create = spawn(PSQL_PATH, ["-h", "localhost", "-p", String(pgPort), "-U", PG_USER, "-d", "postgres", "-c", "CREATE DATABASE stellar_dominion;"], {
        stdio: "inherit",
      });
      create.on("exit", (code) => {
        if (code === 0) {
          console.log("✅ Database stellar_dominion created");
          resolve();
        } else {
          reject(new Error("Failed to create database"));
        }
      });
    });
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

async function startDev() {
  // Start local PostgreSQL if DATABASE_URL not set
  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl) {
    await startLocalPostgres();
    await createDatabaseIfNeeded();
    const pgPort = isWin ? PG_PORT : 5432;
    process.env.DATABASE_URL = `postgresql://${PG_USER}@localhost:${pgPort}/stellar_dominion`;
  }

  const selectedPort = await findAvailablePort(basePort);
  if (selectedPort !== basePort) {
    console.warn(`Port ${basePort} is already in use. Falling back to port ${selectedPort}.`);
  }

  const command = `tsx server/index.ts`;

  console.log("Starting full-stack development server...");

  const child = spawn(command, {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV ?? "development",
      PORT: String(selectedPort),
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
