import { getEventState } from "./eventService";
import { getProtectionState } from "./protectionService";

export async function getOperationsState(userId: string) {
  const [protection, events] = await Promise.all([getProtectionState(userId), getEventState(userId)]);
  return { protection, events, actions: ["raid", "recon", "sabotage", "reviewReports", "vacationMode"] };
}
