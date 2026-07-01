"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminShell, type AdminSection } from "@/components/admin/AdminShell";
import { DashboardSection } from "@/components/admin/DashboardSection";
import { BrandingSection } from "@/components/admin/BrandingSection";
import { CompaniesSection } from "@/components/admin/CompaniesSection";
import { StaffSection } from "@/components/admin/StaffSection";
import { VisitsSection } from "@/components/admin/VisitsSection";
import { VisitorCardsSection } from "@/components/admin/VisitorCardsSection";
import { SystemSection } from "@/components/admin/SystemSection";
import { Toast } from "@/components/admin/ui";
import type { KioskSettings, VisitorCardRecord } from "@/lib/types";

const DEFAULT_SETTINGS: KioskSettings = {
  brandName: "YOBELL",
  tagline: "内線電話のないオフィス受付",
  logoUrl: null,
  welcomeMessage: "ご来社ありがとうございます",
  languageDefault: "ja",
  fallbackMessage: "担当者が応答できません。",
  privacyNotice: "入力された情報は受付対応および来訪記録のために利用されます。",
  heroImageUrl: null,
  heroVideoUrl: null,
  companyDisplayName: "株式会社YOBELL",
  heroTitle: "ようこそ、株式会社YOBELLへ",
  heroSubtitle: "快適なオフィス環境を、すべての人に。",
  primaryColor: "#1a2b4b",
  accentColor: "#c9a227",
  retentionDays: 30,
};

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [dashboard, setDashboard] = useState<unknown>(null);
  const [companies, setCompanies] = useState([]);
  const [staff, setStaff] = useState([]);
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
    setDashboard(await dashRes.json());
    setCompanies(await compRes.json());
    setStaff(await staffRes.json());
    const s = await settingsRes.json();
    setSettings({ ...DEFAULT_SETTINGS, ...s });
    setCards(await cardsRes.json());
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
    if (!res.ok) {
      showMessage("保存に失敗しました", "error");
      return;
    }
    const updated = await res.json();
    setSettings({ ...DEFAULT_SETTINGS, ...updated });
    showMessage("ブランディング設定を保存しました");
  }

  async function saveCards(updated: VisitorCardRecord[]) {
    const res = await fetch("/api/visitor-cards", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) {
      showMessage("保存に失敗しました", "error");
      return;
    }
    setCards(await res.json());
  }

  const dbStatus =
  dashboard && typeof dashboard === "object" && "kioskStatus" in dashboard
    ? (dashboard as { kioskStatus: { database: string } }).kioskStatus.database
    : "unknown";

  return (
    <AdminShell section={section} onSectionChange={setSection}>
      <Toast message={message} type={messageType} />

      {section === "dashboard" && (
        <DashboardSection data={dashboard as Parameters<typeof DashboardSection>[0]["data"]} />
      )}
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
      {section === "system" && (
        <SystemSection dbStatus={dbStatus} onMessage={showMessage} onRefresh={loadData} />
      )}
    </AdminShell>
  );
}
