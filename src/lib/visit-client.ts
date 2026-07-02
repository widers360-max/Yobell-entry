import type { VisitStatus } from "@/lib/types";

export const TERMINAL_VISIT_STATUSES: VisitStatus[] = [
  "accepted",
  "please_wait",
  "declined",
  "no_response",
  "completed",
];

export function isTerminalVisitStatus(status: string): boolean {
  return TERMINAL_VISIT_STATUSES.includes(status as VisitStatus);
}

export async function patchVisitStatus(
  visitId: string,
  status: VisitStatus,
): Promise<boolean> {
  try {
    const res = await fetch(`/api/visits/${visitId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Mark an abandoned pending visit as completed so staff dashboard stays accurate. */
export async function completePendingVisit(
  visitId: string | null | undefined,
  currentStatus: string | undefined,
): Promise<void> {
  if (!visitId || currentStatus !== "pending") return;
  await patchVisitStatus(visitId, "completed");
}
