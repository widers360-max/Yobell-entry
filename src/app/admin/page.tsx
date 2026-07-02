"use client";

import { AdminShell, type AdminSection } from "@/components/admin/AdminShell";
import { AdminI18nProvider, useAdminI18n } from "@/components/admin/AdminI18nProvider";
import { DashboardSection } from "@/components/admin/DashboardSection";
import { BrandingSection } from "@/components/admin/BrandingSection";
import { CompaniesSection } from "@/components/admin/CompaniesSection";
import { StaffSection } from "@/components/admin/StaffSection";
import { VisitsSection } from "@/components/admin/VisitsSection";
import { VisitorCardsSection } from "@/components/admin/VisitorCardsSection";
import { SystemSection } from "@/components/admin/SystemSection";
import { NotificationSection } from "@/components/admin/NotificationSection";
import { Toast } from "@/components/admin/ui";
import { PasswordGate } from "@/components/PasswordGate";
import {
  KIOSK_SHOWROOM_DEFAULTS,
  YOBELL_DEFAULT_ACCENT,
  YOBELL_DEFAULT_PRIMARY,
} from "@/lib/design-system";
import type { KioskSettings, VisitorCardRecord } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";

const DEFAULT_SETTINGS: KioskSettings = {
  brandName: KIOSK_SHOWROOM_DEFAULTS.brandName,
  tagline: KIOSK_SHOWROOM_DEFAULTS.tagline,
  logoUrl: null,
  welcomeMessage: KIOSK_SHOWROOM_DEFAULTS.welcomeMessage,
  languageDefault: "ja",
  fallbackMessage: "担当者が応答できません。",
  privacyNotice: "入力された情報は受付対応および来訪記録のために利用されます。",
  heroImageUrl: null,
  heroVideoUrl: null,
  companyDisplayName: KIOSK_SHOWROOM_DEFAULTS.companyDisplayName,
  heroTitle: KIOSK_SHOWROOM_DEFAULTS.heroTitle,
  heroSubtitle: KIOSK_SHOWROOM_DEFAULTS.heroSubtitle,
  primaryColor: YOBELL_DEFAULT_PRIMARY,
  accentColor: YOBELL_DEFAULT_ACCENT,
  retentionDays: 30,
  idleTimeoutSeconds: KIOSK_SHOWROOM_DEFAULTS.idleTimeoutSeconds,
};

const DEFAULT_DASHBOARD = {
  stats: {
    todayVisits: 0,
    pending: 0,
    responded: 0,
    staffCount: 0,
    companyCount: 0,
    monthVisits: 0,
    avgResponseSeconds: null as number | null,
  },
  visitTrend: [] as Array<{ date: string; count: number }>,
  latestVisits: [] as Array<{
    id: string;
    visitorName: string;
    visitorCompany: string | null;
    visitorType: string;
    status: string;
    createdAt: string;
    hostStaff: { name: string };
  }>,
  kioskStatus: {
    online: false,
    database: "disconnected",
    camera: "browser camera",
    company: "—",
  },
};

async function safeJson<T>(res: Response, fallback: T): Promise<T> {
  try {
    const text = await res.text();
    if (!text.trim()) {
      if (!res.ok) {
        console.error(`[admin] Empty response from ${res.url} (status ${res.status})`);
      }
      return fallback;
    }
    const parsed = JSON.parse(text) as T;
    if (!res.ok) {
      console.error(`[admin] Error response from ${res.url}:`, parsed);
    }
    return parsed;
  } catch (error) {
    console.error(`[admin] Failed to parse JSON from ${res.url}:`, error);
    return fallback;
  }
}

export default function AdminPage() {
  return (
    <PasswordGate role="admin">
      <AdminI18nProvider>
        <AdminPageContent />
      </AdminI18nProvider>
    </PasswordGate>
  );
}

function AdminPageContent() {
  const { t } = useAdminI18n();
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [dashboard, setDashboard] = useState<typeof DEFAULT_DASHBOARD | null>(null);
  const [companies, setCompanies] = useState<
    Array<{
      id: string;
      name: string;
      logoUrl: string | null;
      welcomeMessage: string | null;
      active: boolean;
      _count: { staff: number };
    }>
  >([]);
  const [staff, setStaff] = useState<
    Array<{
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
      company: { name: string };
    }>
  >([]);
  const [settings, setSettings] = useState<KioskSettings>(DEFAULT_SETTINGS);
  const [cards, setCards] = useState<VisitorCardRecord[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3500);
  };

  const loadData = useCallback(async () => {
    const [dashRes, compRes, staffRes, settingsRes, cardsRes] = await Promise.all([
      fetch("/api/admin/dashboard"),
      fetch("/api/companies"),
      fetch("/api/staff?active=false"),
      fetch("/api/settings"),
      fetch("/api/visitor-cards"),
    ]);

    const [dash, comps, staffList, settingsData, cardsList] = await Promise.all([
      safeJson(dashRes, DEFAULT_DASHBOARD),
      safeJson(compRes, [] as typeof companies),
      safeJson(staffRes, [] as typeof staff),
      safeJson(settingsRes, DEFAULT_SETTINGS),
      safeJson(cardsRes, [] as VisitorCardRecord[]),
    ]);

    setDashboard(dash);
    setCompanies(Array.isArray(comps) ? comps : []);
    setStaff(Array.isArray(staffList) ? staffList : []);
    setSettings({ ...DEFAULT_SETTINGS, ...settingsData });
    setCards(Array.isArray(cardsList) ? cardsList : []);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function saveSettings(data: Partial<KioskSettings>) {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await safeJson(res, null as KioskSettings | null);
    if (!res.ok || !updated || "error" in (updated as object)) {
      showMessage(t("msg_saveFailed"), "error");
      return;
    }
    setSettings({ ...DEFAULT_SETTINGS, ...updated });
    showMessage(t("msg_brandingSaved"));
  }

  async function saveCards(updated: VisitorCardRecord[]) {
    const res = await fetch("/api/visitor-cards", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const saved = await safeJson(res, [] as VisitorCardRecord[]);
    if (!res.ok || !Array.isArray(saved)) {
      showMessage(t("msg_saveFailed"), "error");
      return;
    }
    setCards(saved);
  }

  const dbStatus = dashboard?.kioskStatus?.database ?? "unknown";

  return (
    <AdminShell section={section} onSectionChange={setSection}>
      <Toast message={message} type={messageType} />

      {section === "dashboard" && <DashboardSection data={dashboard} />}
      {section === "branding" && (
        <BrandingSection settings={settings} cards={cards} onSave={saveSettings} />
      )}
      {section === "companies" && (
        <CompaniesSection companies={companies} onRefresh={loadData} onMessage={showMessage} />
      )}
      {section === "staff" && (
        <StaffSection staff={staff} companies={companies} onRefresh={loadData} onMessage={showMessage} />
      )}
      {section === "visits" && (
        <VisitsSection retentionDays={settings.retentionDays} onMessage={showMessage} />
      )}
      {section === "cards" && (
        <VisitorCardsSection cards={cards} onSave={saveCards} onMessage={showMessage} />
      )}
      {section === "notification" && (
        <NotificationSection onMessage={showMessage} />
      )}
      {section === "system" && (
        <SystemSection dbStatus={dbStatus} onMessage={showMessage} onRefresh={loadData} />
      )}
    </AdminShell>
  );
}
