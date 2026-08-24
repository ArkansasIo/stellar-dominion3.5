import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { normalizeAdminResourceDelta } from "../shared/config/adminConsole";

const baseUrl = (process.env.ADMIN_BASE_URL || "http://localhost:5001").replace(/\/$/, "");
const sessionCookie = process.env.ADMIN_SESSION_COOKIE || "";
const totalRequests = Math.max(60, Math.min(1200, Number(process.env.ADMIN_STRESS_REQUESTS || 240)));
const concurrency = Math.max(4, Math.min(80, Number(process.env.ADMIN_STRESS_CONCURRENCY || 24)));
const target = process.env.ADMIN_STRESS_TARGET || "edge-case-player-does-not-exist";

const edgeValues: unknown[] = [
  Number.MAX_SAFE_INTEGER,
  -Number.MAX_SAFE_INTEGER,
  1.5,
  "1000000",
  "-999999999999",
  "1e309",
  "NaN",
  null,
  "",
];

const readCases = [
  { method: "GET", path: "/api/admin/hub/overview" },
  { method: "GET", path: "/api/admin/hub/players" },
  { method: "GET", path: "/api/admin/hub/players?q=%25%25%25&limit=100" },
  { method: "GET", path: `/api/admin/hub/players/${encodeURIComponent(target)}` },
];

const cases = Array.from({ length: totalRequests }, (_, index) => {
  if (index % 3 !== 2) return { ...readCases[index % readCases.length], label: "read" };
  const edgeValue = edgeValues[index % edgeValues.length];
  return {
    method: "POST",
    path: `/api/admin/hub/players/${encodeURIComponent(target)}/grant-resources`,
    body: { resources: { naquadah: edgeValue, food: edgeValue, water: edgeValue, energy: edgeValue } },
    label: `edge-${String(edgeValue)}`,
  };
});

type Result = {
  index: number;
  method: string;
  path: string;
  label: string;
  status: number;
  elapsedMs: number;
  responseBytes: number;
  error?: string;
};

async function runCase(requestCase: (typeof cases)[number], index: number): Promise<Result> {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(`${baseUrl}${requestCase.path}`, {
      method: requestCase.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(sessionCookie ? { Cookie: sessionCookie } : {}),
      },
      body: requestCase.body ? JSON.stringify(requestCase.body) : undefined,
      signal: controller.signal,
    });
    const payload = await response.text();
    return {
      index,
      method: requestCase.method,
      path: requestCase.path,
      label: requestCase.label,
      status: response.status,
      elapsedMs: Math.round((performance.now() - started) * 100) / 100,
      responseBytes: Buffer.byteLength(payload),
    };
  } catch (error) {
    return {
      index,
      method: requestCase.method,
      path: requestCase.path,
      label: requestCase.label,
      status: 0,
      elapsedMs: Math.round((performance.now() - started) * 100) / 100,
      responseBytes: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  assert.deepEqual(normalizeAdminResourceDelta({ naquadah: Number.MAX_SAFE_INTEGER, food: -Number.MAX_SAFE_INTEGER, water: 1.5 }), { naquadah: 1_000_000_000, food: -1_000_000_000, water: 1 });
  assert.equal(normalizeAdminResourceDelta({ water: "NaN" }), null);
  assert.equal(normalizeAdminResourceDelta({ water: 0 }), null);
  assert.equal(normalizeAdminResourceDelta({ water: "" }), null);

  const results: Result[] = [];
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= cases.length) return;
      results.push(await runCase(cases[index], index));
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, cases.length) }, () => worker()));
  results.sort((a, b) => a.index - b.index);

  const statusCounts = Object.fromEntries(
    [...new Set(results.map((result) => result.status))].sort((a, b) => a - b)
      .map((status) => [String(status), results.filter((result) => result.status === status).length]),
  );
  const latencies = results.map((result) => result.elapsedMs).sort((a, b) => a - b);
  const percentile = (ratio: number) => latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * ratio))] || 0;
  const transportErrors = results.filter((result) => result.status === 0);
  const serverErrors = results.filter((result) => result.status >= 500);
  const authBoundaryResults = results.filter((result) => !sessionCookie && (result.status === 401 || result.status === 429));
  const invalidAuthBoundary = !sessionCookie ? results.length - authBoundaryResults.length : 0;

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    authenticatedMode: Boolean(sessionCookie),
    totalRequests,
    concurrency,
    target,
    statusCounts,
    latencyMs: { min: latencies[0] || 0, p50: percentile(0.5), p95: percentile(0.95), max: latencies.at(-1) || 0 },
    transportErrors: transportErrors.length,
    serverErrors: serverErrors.length,
    authBoundary: sessionCookie ? "authenticated session supplied" : {
      expectedStatuses: [401, 429],
      acceptedResponses: authBoundaryResults.length,
      unexpectedResponses: invalidAuthBoundary,
    },
    edgeValues,
    sampleFailures: results.filter((result) => result.error || result.status >= 500).slice(0, 12),
  };

  const outputPath = path.join(process.cwd(), "notes", "admin-console-stress-latest.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  assert.equal(transportErrors.length, 0, `transport failures: ${transportErrors.length}`);
  assert.equal(serverErrors.length, 0, `server errors: ${serverErrors.length}`);
  if (!sessionCookie) {
    assert.equal(invalidAuthBoundary, 0, `unexpected unauthenticated responses: ${invalidAuthBoundary}`);
  }

  console.log(JSON.stringify(report, null, 2));
  console.log(`PASS — ${totalRequests} requests issued with concurrency ${concurrency}; no transport or 5xx failures.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
