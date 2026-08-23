import assert from "node:assert/strict";
import fs from "node:fs/promises";

const baseUrl = process.env.APP_BASE_URL || "http://localhost:5001";
const appSource = await fs.readFile("client/src/App.tsx", "utf8");
const routePatterns = [...appSource.matchAll(/<Route path="([^"]+)"/g)]
  .map((match) => match[1])
  .filter(Boolean)
  .filter((route, index, routes) => routes.indexOf(route) === index)
  .sort();

const routes = routePatterns.map((pattern) => ({
  pattern,
  route: pattern.replace(/:[^/]+/g, "test"),
}));

const results = [];
for (const { pattern, route } of routes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  results.push({ pattern, route, status: response.status });
}

const failures = results.filter((result) => result.status < 200 || result.status >= 400);
const healthResponse = await fetch(`${baseUrl}/api/status/health`);
const health = await healthResponse.json();

assert.equal(failures.length, 0, `Static client route failures: ${JSON.stringify(failures)}`);
assert.equal(healthResponse.status, 200, "Health endpoint must return HTTP 200");
assert.equal(health.status, "healthy", "Health endpoint must report healthy");

console.log(JSON.stringify({
  baseUrl,
  checkedRoutePatterns: results.length,
  failures,
  health: { status: health.status, score: health.score },
  representativeRoutes: results.filter((result) => ["/", "/stargate-command", "/stargate-command/test", "/stargate-market", "/stargate-worlds", "/settings"].includes(result.route)),
}, null, 2));
