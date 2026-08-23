import { buildSystemSnapshot, loadSystemContext } from "./systemStateService";

export async function getEventState(userId: string) {
  const context = await loadSystemContext(userId);
  return { ...buildSystemSnapshot(context), events: context.systems.events, count: context.systems.events.length };
}
