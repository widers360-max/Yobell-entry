export type Language = "ja" | "en" | "ko";

export type VisitorType =
  | "meeting"
  | "delivery"
  | "interview"
  | "maintenance"
  | "other";

export type VisitStatus =
  | "pending"
  | "accepted"
  | "please_wait"
  | "declined"
  | "no_response"
  | "completed";

export interface KioskState {
  language: Language;
  visitorType: VisitorType | null;
  hostStaffId: string | null;
  hostStaffName: string | null;
  hostCompanyName: string | null;
  visitorCompany: string;
  visitorName: string;
  visitorPhone: string;
  purpose: string;
  privacyConsent: boolean;
  photoData: string | null;
  visitId: string | null;
}

export const VISITOR_TYPE_KEYS: VisitorType[] = [
  "meeting",
  "delivery",
  "interview",
  "maintenance",
  "other",
];

export const INITIAL_KIOSK_STATE: KioskState = {
  language: "ja",
  visitorType: null,
  hostStaffId: null,
  hostStaffName: null,
  hostCompanyName: null,
  visitorCompany: "",
  visitorName: "",
  visitorPhone: "",
  purpose: "",
  privacyConsent: false,
  photoData: null,
  visitId: null,
};
