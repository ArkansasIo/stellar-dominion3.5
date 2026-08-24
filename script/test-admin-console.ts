import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ADMIN_CONSOLE_MENUS, ADMIN_RESOURCE_KEYS, hasAdminCapability } from "../shared/config/adminConsole";

const root = process.cwd();
const routeSource = fs.readFileSync(path.join(root, "server/routes-admin-hub.ts"), "utf8");
const shellSource = fs.readFileSync(path.join(root, "client/src/components/admin/AdminConsoleShell.tsx"), "utf8");
const operationsSource = fs.readFileSync(path.join(root, "client/src/components/admin/AdminPlayerOperations.tsx"), "utf8");

assert.equal(ADMIN_CONSOLE_MENUS.length, 10, "admin console must expose ten top-level systems");
const menuIds = new Set<string>();
for (const menu of ADMIN_CONSOLE_MENUS) {
  assert.equal(menuIds.has(menu.id), false, `duplicate admin system: ${menu.id}`);
  menuIds.add(menu.id);
  assert.ok(menu.label && menu.description, `${menu.id} must have navigation copy`);
  assert.equal(hasAdminCapability(["view_only"], menu.capability), menu.capability === "view_only");
  assert.equal(menu.subMenus.length, 2, `${menu.id} must expose two submenus`);
  const submenuIds = new Set<string>();
  for (const submenu of menu.subMenus) {
    assert.equal(submenuIds.has(submenu.id), false, `duplicate submenu: ${menu.id}/${submenu.id}`);
    submenuIds.add(submenu.id);
    assert.ok(submenu.label && submenu.description, `${menu.id}/${submenu.id} must have navigation copy`);
  }
}

for (const endpoint of [
  "/api/admin/hub/overview",
  "/api/admin/hub/players",
  "/api/admin/hub/players/:identifier",
  "/grant-resources",
  "/reset",
  "/progression",
]) {
  assert.ok(routeSource.includes(endpoint), `missing admin hub endpoint: ${endpoint}`);
}
assert.ok(routeSource.includes("requireAdminPermission(req, res, \"view_only\")"), "overview/list/detail must be view-gated");
assert.ok(routeSource.includes("requireAdminPermission(req, res, \"manage\")"), "resource operations must be manage-gated");
assert.ok(routeSource.includes("requireAdminPermission(req, res, \"developer_tools\")"), "reset/progression operations must be developer-gated");
assert.ok(routeSource.includes("appendAudit"), "admin hub mutations must use the durable audit writer");

for (const resource of ADMIN_RESOURCE_KEYS) {
  assert.ok(operationsSource.includes(`{ key: \"${resource}\"`) || resource === "credits" || resource === "darkMatter", `resource control missing: ${resource}`);
}
for (const label of ["Search Players", "Apply Resource Delta", "Set Progression", "Reset Resources", "Reset Progress"]) {
  assert.ok(operationsSource.includes(label), `missing player operations control: ${label}`);
}
assert.ok(shellSource.includes("aria-label=\"Admin systems\""), "admin shell must expose accessible navigation");
assert.ok(shellSource.includes("onSelect(menu.id"), "admin menu buttons must have working selection handlers");

console.log(`PASS — ${ADMIN_CONSOLE_MENUS.length} admin systems, ${ADMIN_CONSOLE_MENUS.reduce((total, menu) => total + menu.subMenus.length, 0)} submenus, ${ADMIN_RESOURCE_KEYS.length} resource keys, and all hub control contracts verified.`);
