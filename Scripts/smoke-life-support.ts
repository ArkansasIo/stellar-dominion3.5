type JsonValue = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

const baseUrl = process.env.BASE_URL ?? "http://localhost:5001";

async function readPayload(response: Response): Promise<JsonValue | string | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    return text;
  }
}

async function request(path: string) {
  const response = await fetch(`${baseUrl}${path}`);
  const payload = await readPayload(response);
  return { response, payload };
}

function fail(message: string): never {
  console.error(`[smoke:life-support] ${message}`);
  process.exit(1);
}

async function main() {
  console.log(`[smoke:life-support] Base URL: ${baseUrl}`);

  const publicRoute = await request("/api/config/life-support-systems");
  if (!publicRoute.response.ok) {
    fail(`Expected 200 from /api/config/life-support-systems, got ${publicRoute.response.status}`);
  }

  if (typeof publicRoute.payload !== "object" || publicRoute.payload === null || !("success" in publicRoute.payload)) {
    fail("Public life-support route did not return the expected JSON shape.");
  }

  console.log("[smoke:life-support] Public config route OK");

  const snapshotRoute = await request("/api/population/snapshot");
  if (snapshotRoute.response.status !== 200 && snapshotRoute.response.status !== 401) {
    fail(`Expected 200 or 401 from /api/population/snapshot, got ${snapshotRoute.response.status}`);
  }

  console.log(`[smoke:life-support] Population snapshot route OK (${snapshotRoute.response.status})`);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : "Unknown error");
});