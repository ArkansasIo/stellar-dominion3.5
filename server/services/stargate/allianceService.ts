import { db } from "../../db";
import { appendSystemEvent, buildSystemSnapshot, loadSystemContext, saveSystemContext } from "./systemStateService";

type AllianceDirectoryEntry = { leaderId: string; id: string; name: string; tag: string; notice: string; members: number };

async function allianceDirectory(): Promise<AllianceDirectoryEntry[]> {
  const rows = await db.query.playerStates.findMany();
  const entries = rows.flatMap((row) => {
    const government = row.government && typeof row.government === "object" && !Array.isArray(row.government) ? row.government as Record<string, unknown> : {};
    const systems = government.stargateSystems && typeof government.stargateSystems === "object" ? government.stargateSystems as Record<string, unknown> : {};
    const alliance = systems.alliance && typeof systems.alliance === "object" ? systems.alliance as Record<string, unknown> : {};
    return alliance.role === "leader" && typeof alliance.id === "string" && typeof alliance.name === "string" && typeof alliance.tag === "string"
      ? [{ leaderId: row.userId, id: alliance.id, name: alliance.name, tag: alliance.tag, notice: typeof alliance.notice === "string" ? alliance.notice : "", members: rows.filter((candidate) => { const candidateGov = candidate.government && typeof candidate.government === "object" ? candidate.government as Record<string, unknown> : {}; const candidateSystems = candidateGov.stargateSystems && typeof candidateGov.stargateSystems === "object" ? candidateGov.stargateSystems as Record<string, unknown> : {}; const candidateAlliance = candidateSystems.alliance && typeof candidateSystems.alliance === "object" ? candidateSystems.alliance as Record<string, unknown> : {}; return candidateAlliance.id === alliance.id; }).length }]
      : [];
  });
  return entries;
}

export async function getAllianceState(userId: string) {
  const context = await loadSystemContext(userId);
  return { ...buildSystemSnapshot(context), alliance: context.systems.alliance, directory: await allianceDirectory() };
}

export async function createAlliance(userId: string, name: string, tag: string) {
  const context = await loadSystemContext(userId);
  if (context.systems.alliance.id) throw new Error("Leave your current alliance before creating another");
  const nextName = name.trim().slice(0, 40);
  const nextTag = tag.trim().toUpperCase().slice(0, 5);
  if (nextName.length < 3 || nextTag.length < 2) throw new Error("Alliance name and tag are too short");
  const exists = (await allianceDirectory()).some((entry) => entry.tag === nextTag || entry.name.toLowerCase() === nextName.toLowerCase());
  if (exists) throw new Error("Alliance name or tag is already in use");
  context.systems.alliance = { id: `alliance-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: nextName, tag: nextTag, role: "leader", applications: [], notice: "New alliance formed." };
  context.systems = appendSystemEvent(context.systems, "alliance.created", `Created alliance ${nextTag}.`, { name: nextName, tag: nextTag });
  await saveSystemContext(context);
  return getAllianceState(userId);
}

export async function applyToAlliance(userId: string, leaderId: string) {
  const applicant = await loadSystemContext(userId);
  if (applicant.systems.alliance.id) throw new Error("Leave your current alliance before applying");
  const leader = await loadSystemContext(leaderId);
  if (leader.systems.alliance.role !== "leader" || !leader.systems.alliance.id) throw new Error("Alliance leader not found");
  if (leader.systems.alliance.applications.some((entry) => entry.userId === userId)) throw new Error("Application already pending");
  leader.systems.alliance.applications.push({ userId, createdAt: Date.now() });
  leader.systems = appendSystemEvent(leader.systems, "alliance.application", "Received an alliance application.", { applicantId: userId });
  applicant.systems = appendSystemEvent(applicant.systems, "alliance.applied", `Applied to ${leader.systems.alliance.tag}.`, { leaderId });
  await Promise.all([saveSystemContext(leader), saveSystemContext(applicant)]);
  return getAllianceState(userId);
}

export async function approveAllianceApplication(userId: string, applicantId: string) {
  const leader = await loadSystemContext(userId);
  if (leader.systems.alliance.role !== "leader" || !leader.systems.alliance.id) throw new Error("Only an alliance leader can approve applications");
  if (!leader.systems.alliance.applications.some((entry) => entry.userId === applicantId)) throw new Error("Alliance application not found");
  const applicant = await loadSystemContext(applicantId);
  if (applicant.systems.alliance.id) throw new Error("Applicant already belongs to an alliance");
  applicant.systems.alliance = { id: leader.systems.alliance.id, name: leader.systems.alliance.name, tag: leader.systems.alliance.tag, role: "member", applications: [], notice: leader.systems.alliance.notice };
  leader.systems.alliance.applications = leader.systems.alliance.applications.filter((entry) => entry.userId !== applicantId);
  leader.systems = appendSystemEvent(leader.systems, "alliance.application.approved", "Approved an alliance application.", { applicantId });
  applicant.systems = appendSystemEvent(applicant.systems, "alliance.joined", `Joined alliance ${leader.systems.alliance.tag}.`, { leaderId: userId });
  await Promise.all([saveSystemContext(leader), saveSystemContext(applicant)]);
  return getAllianceState(userId);
}

export async function leaveAlliance(userId: string) {
  const context = await loadSystemContext(userId);
  if (!context.systems.alliance.id) throw new Error("This realm is not part of an alliance");
  if (context.systems.alliance.role === "leader") throw new Error("Alliance leaders must transfer leadership before leaving");
  const oldTag = context.systems.alliance.tag;
  context.systems.alliance = { id: null, name: null, tag: null, role: null, applications: [], notice: "" };
  context.systems = appendSystemEvent(context.systems, "alliance.left", `Left alliance ${oldTag}.`);
  await saveSystemContext(context);
  return getAllianceState(userId);
}

export async function setAllianceNotice(userId: string, notice: string) {
  const context = await loadSystemContext(userId);
  if (context.systems.alliance.role !== "leader") throw new Error("Only an alliance leader can update the notice");
  context.systems.alliance.notice = notice.trim().slice(0, 280);
  context.systems = appendSystemEvent(context.systems, "alliance.notice", "Updated alliance notice.");
  await saveSystemContext(context);
  return getAllianceState(userId);
}
