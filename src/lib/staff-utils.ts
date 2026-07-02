import type { Language } from "./types";
import { t, type TranslationKey } from "./i18n";

export type StaffStatus = "available" | "meeting" | "away" | "unavailable";

export type StaffNotificationMethod =
  | "email"
  | "line_works"
  | "slack"
  | "teams"
  | "phone"
  | "dashboard";

export interface KioskStaffMember {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string | null;
  phone: string | null;
  notificationMethod: string;
  staffStatus: string;
  active: boolean;
  companyId: string;
  company: { id: string; name: string };
}

export const STAFF_STATUSES: StaffStatus[] = [
  "available",
  "meeting",
  "away",
  "unavailable",
];

export const NOTIFICATION_METHODS: StaffNotificationMethod[] = [
  "email",
  "line_works",
  "slack",
  "teams",
  "phone",
  "dashboard",
];

export function staffInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
  }
  return name.trim().slice(0, 2) || "?";
}

export function normalizeStaffStatus(status: string | null | undefined): StaffStatus {
  if (status && STAFF_STATUSES.includes(status as StaffStatus)) {
    return status as StaffStatus;
  }
  return "available";
}

export function staffStatusLabel(lang: Language, status: string | null | undefined): string {
  const key = `staffStatus_${normalizeStaffStatus(status)}` as TranslationKey;
  return t(lang, key);
}

export function notificationMethodLabel(
  lang: Language,
  method: string | null | undefined,
): string {
  const normalized = method ?? "email";
  const key = `notifyMethod_${normalized}` as TranslationKey;
  return t(lang, key);
}

export function groupStaffByCompany(
  staff: KioskStaffMember[],
): [string, KioskStaffMember[]][] {
  const groups = new Map<string, KioskStaffMember[]>();

  for (const member of staff) {
    const companyName = member.company.name;
    const existing = groups.get(companyName);
    if (existing) {
      existing.push(member);
    } else {
      groups.set(companyName, [member]);
    }
  }

  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, "ja"));
}

export function findReceptionStaff(staff: KioskStaffMember[]): KioskStaffMember | null {
  const receptionPattern = /受付|reception|front\s*desk|접수/i;

  const scored = staff
    .map((member) => {
      let score = 0;
      if (receptionPattern.test(member.name)) score += 4;
      if (receptionPattern.test(member.role)) score += 3;
      if (receptionPattern.test(member.department)) score += 2;
      if (member.company.name.includes("大建") && receptionPattern.test(member.name)) {
        score += 2;
      }
      return { member, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) return scored[0].member;
  return staff[0] ?? null;
}

export function staffStatusTone(status: StaffStatus): "success" | "warning" | "muted" | "danger" {
  switch (status) {
    case "available":
      return "success";
    case "meeting":
      return "warning";
    case "away":
      return "muted";
    case "unavailable":
      return "danger";
  }
}
