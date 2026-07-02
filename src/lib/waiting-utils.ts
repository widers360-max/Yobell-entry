export type ProgressStepState = "pending" | "success" | "failed";

export interface WaitingHostInfo {
  name: string;
  companyName: string;
  department: string;
  role: string;
  staffStatus: string;
}

export interface WaitingVisitSnapshot {
  status: string;
  notificationSent: boolean;
  notificationError: string | null;
  hostStaff: {
    name: string;
    department: string;
    role: string;
    staffStatus: string;
    company: { name: string };
  } | null;
}

export interface NotificationProgressStep {
  id: "create" | "notify" | "await";
  state: ProgressStepState;
}

export function resolveWaitingHost(
  snapshot: WaitingVisitSnapshot | null,
  fallback: WaitingHostInfo | null,
): WaitingHostInfo | null {
  if (snapshot?.hostStaff) {
    return {
      name: snapshot.hostStaff.name,
      companyName: snapshot.hostStaff.company.name,
      department: snapshot.hostStaff.department,
      role: snapshot.hostStaff.role,
      staffStatus: snapshot.hostStaff.staffStatus ?? "available",
    };
  }
  return fallback;
}

export function buildNotificationProgress(
  snapshot: WaitingVisitSnapshot | null,
  visitStatus: string,
  hasVisit: boolean,
): NotificationProgressStep[] {
  const notifyState: ProgressStepState = snapshot?.notificationSent
    ? "success"
    : snapshot?.notificationError
      ? "failed"
      : hasVisit
        ? "pending"
        : "pending";

  let awaitState: ProgressStepState = "pending";
  if (visitStatus === "accepted" || visitStatus === "please_wait") {
    awaitState = "success";
  } else if (visitStatus === "declined" || visitStatus === "no_response") {
    awaitState = "failed";
  }

  return [
    { id: "create", state: hasVisit ? "success" : "pending" },
    { id: "notify", state: notifyState },
    { id: "await", state: awaitState },
  ];
}

export function parseVisitSnapshot(visit: {
  status: string;
  notificationSent?: boolean;
  notificationError?: string | null;
  hostStaff?: WaitingVisitSnapshot["hostStaff"];
}): WaitingVisitSnapshot {
  return {
    status: visit.status,
    notificationSent: Boolean(visit.notificationSent),
    notificationError: visit.notificationError ?? null,
    hostStaff: visit.hostStaff ?? null,
  };
}
