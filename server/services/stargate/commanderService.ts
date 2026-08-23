import { appendSystemEvent, buildSystemSnapshot, loadSystemContext, saveSystemContext } from "./systemStateService";

export type OfficerRole = "income" | "offense" | "defense" | "covert";
const OFFICER_ROLES: OfficerRole[] = ["income", "offense", "defense", "covert"];

export async function getCommanderState(userId: string) {
  const context = await loadSystemContext(userId);
  return { ...buildSystemSnapshot(context), commander: context.systems.commander };
}

export async function updateCommanderProfile(userId: string, name: string, incomeShare: number) {
  const context = await loadSystemContext(userId);
  const nextName = name.trim().slice(0, 36);
  if (!nextName) throw new Error("Commander name is required");
  const share = Math.min(0.3, Math.max(0.1, Number(incomeShare) || 0.1));
  context.systems.commander = { ...context.systems.commander, name: nextName, incomeShare: share };
  context.systems = appendSystemEvent(context.systems, "commander.profile", `Commander profile updated for ${nextName}.`, { incomeShare: share });
  await saveSystemContext(context);
  return getCommanderState(userId);
}

export async function recruitOfficer(userId: string, role: OfficerRole) {
  if (!OFFICER_ROLES.includes(role)) throw new Error("Unsupported officer role");
  const context = await loadSystemContext(userId);
  if (context.systems.commander.officers.length >= 25) throw new Error("Maximum officer capacity reached");
  const cost = 5_000 + context.systems.commander.officers.length * 2_500;
  if (context.resources.naquadah < cost) throw new Error("Insufficient Naquadah to recruit an officer");
  context.resources.naquadah -= cost;
  const officer = { id: `officer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role, level: 1 };
  context.systems.commander = { ...context.systems.commander, officers: [...context.systems.commander.officers, officer] };
  context.systems = appendSystemEvent(context.systems, "commander.officer.recruited", `Recruited ${role} officer.`, { officerId: officer.id, cost });
  await saveSystemContext(context);
  return getCommanderState(userId);
}

export async function dismissOfficer(userId: string, officerId: string) {
  const context = await loadSystemContext(userId);
  const officer = context.systems.commander.officers.find((entry) => entry.id === officerId);
  if (!officer) throw new Error("Officer not found");
  context.systems.commander = { ...context.systems.commander, officers: context.systems.commander.officers.filter((entry) => entry.id !== officerId) };
  context.systems = appendSystemEvent(context.systems, "commander.officer.dismissed", `Dismissed ${officer.role} officer.`, { officerId });
  await saveSystemContext(context);
  return getCommanderState(userId);
}
