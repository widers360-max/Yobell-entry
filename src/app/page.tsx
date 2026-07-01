"use client";

import { useState, useEffect, useCallback } from "react";
import { KioskLayout } from "@/components/KioskLayout";
import { KioskHomeScreen } from "@/components/KioskHomeScreen";
import { CameraCapture } from "@/components/CameraCapture";
import {
  INITIAL_KIOSK_STATE,
  type KioskState,
  type KioskSettings,
  type Language,
  type VisitorType,
  type VisitorCardRecord,
} from "@/lib/types";
import { t, visitorTypeLabel, waitingMessage } from "@/lib/i18n";

type Step =
  | "idle"
  | "host"
  | "visitorInfo"
  | "photo"
  | "confirm"
  | "waiting";

interface StaffMember {
  id: string;
  name: string;
  department: string;
  role: string;
  company: { id: string; name: string };
}

const DEFAULT_SETTINGS: KioskSettings = {
  brandName: "YOBELL",
  tagline: "内線電話のないオフィス受付",
  logoUrl: null,
  welcomeMessage: "ご来社ありがとうございます",
  languageDefault: "ja",
  fallbackMessage:
    "担当者が応答できません。お手数ですがお電話またはメールでご連絡ください。",
  privacyNotice:
    "入力された情報は受付対応および来訪記録のために利用されます。",
  heroImageUrl: null,
  heroVideoUrl: null,
  companyDisplayName: "株式会社YOBELL",
  heroTitle: "ようこそ、株式会社YOBELLへ",
  heroSubtitle: "快適なオフィス環境を、すべての人に。",
  primaryColor: "#1a2b4b",
  accentColor: "#c9a227",
  retentionDays: 30,
};

export default function KioskPage() {
  const [step, setStep] = useState<Step>("idle");
  const [state, setState] = useState<KioskState>(INITIAL_KIOSK_STATE);
  const [settings, setSettings] = useState<KioskSettings | null>(null);
  const [visitorCards, setVisitorCards] = useState<VisitorCardRecord[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visitStatus, setVisitStatus] = useState("pending");
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/visitor-cards").then((r) => r.json()),
    ])
      .then(([settingsData, cardsData]: [KioskSettings, VisitorCardRecord[]]) => {
        setSettings({ ...DEFAULT_SETTINGS, ...settingsData });
        setVisitorCards(cardsData);
        setState((s) => ({
          ...s,
          language: (settingsData.languageDefault as Language) || "ja",
        }));
      })
      .catch(() => {});
  }, []);

  const fetchStaff = useCallback(async (q: string) => {
    const params = new URLSearchParams({ active: "true" });
    if (q) params.set("q", q);
    const res = await fetch(`/api/staff?${params}`);
    const data = await res.json();
    setStaff(data);
  }, []);

  useEffect(() => {
    if (step === "host") {
      const timer = setTimeout(() => fetchStaff(searchQuery), 300);
      return () => clearTimeout(timer);
    }
  }, [step, searchQuery, fetchStaff]);

  useEffect(() => {
    if (step !== "waiting" || !state.visitId) return;

    const poll = setInterval(async () => {
      const res = await fetch(`/api/visits/${state.visitId}`);
      if (!res.ok) return;
      const visit = await res.json();
      setVisitStatus(visit.status);
    }, 2000);

    return () => clearInterval(poll);
  }, [step, state.visitId]);

  useEffect(() => {
    if (step !== "waiting") return;

    const timer = setInterval(() => {
      setWaitSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (
      step === "waiting" &&
      waitSeconds >= 60 &&
      visitStatus === "pending"
    ) {
      if (state.visitId) {
        fetch(`/api/visits/${state.visitId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "no_response" }),
        });
      }
      setVisitStatus("no_response");
    }
  }, [step, waitSeconds, visitStatus, state.visitId]);

  function resetKiosk() {
    setStep("idle");
    setState({
      ...INITIAL_KIOSK_STATE,
      language: state.language,
    });
    setSearchQuery("");
    setVisitStatus("pending");
    setWaitSeconds(0);
    setFormError("");
  }

  function setLanguage(lang: Language) {
    setState((s) => ({ ...s, language: lang }));
  }

  async function submitVisit() {
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorName: state.visitorName,
        visitorCompany: state.visitorCompany || null,
        visitorPhone: state.visitorPhone || null,
        purpose: state.purpose || null,
        visitorType: state.visitorType,
        hostStaffId: state.hostStaffId,
        photoData: state.photoData,
      }),
    });
    const visit = await res.json();
    setState((s) => ({ ...s, visitId: visit.id }));
    setStep("waiting");
    setWaitSeconds(0);
    setVisitStatus("pending");
  }

  function handleSelectPurpose(type: VisitorType) {
    setState((s) => ({ ...s, visitorType: type }));
    setStep("host");
  }

  const lang = state.language;
  const kioskSettings = settings ?? DEFAULT_SETTINGS;
  const tagline = kioskSettings.tagline ?? t(lang, "tagline");
  const privacyNotice = kioskSettings.privacyNotice ?? t(lang, "privacyNotice");
  const fallbackMsg = kioskSettings.fallbackMessage ?? t(lang, "waitingFallback");

  if (step === "idle") {
    return (
      <KioskHomeScreen
        language={lang}
        onLanguageChange={setLanguage}
        settings={kioskSettings}
        visitorCards={visitorCards}
        onSelectPurpose={handleSelectPurpose}
      />
    );
  }

  return (
    <KioskLayout
      language={lang}
      onLanguageChange={setLanguage}
      showLanguageToggle={false}
      brandName={kioskSettings.brandName}
      tagline={tagline}
      logoUrl={kioskSettings.logoUrl}
    >
      {step === "host" && (
        <div className="flex flex-col gap-6">
          <h2 className="kiosk-heading text-center text-4xl">
            {t(lang, "selectHost")}
          </h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(lang, "searchPlaceholder")}
            className="kiosk-input"
          />
          <div className="grid max-h-[50vh] grid-cols-1 gap-4 overflow-y-auto pr-2 sm:grid-cols-2">
            {staff.length === 0 ? (
              <p className="col-span-full py-12 text-center text-xl text-[var(--yobell-muted)]">
                {t(lang, "noResults")}
              </p>
            ) : (
              staff.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    setState((s) => ({
                      ...s,
                      hostStaffId: member.id,
                      hostStaffName: member.name,
                      hostCompanyName: member.company.name,
                    }));
                    setStep("visitorInfo");
                  }}
                  className="kiosk-card-interactive flex flex-col items-start gap-2 p-6 text-left"
                >
                  <span className="text-2xl font-bold">{member.name}</span>
                  <span className="text-lg text-[var(--yobell-muted)]">
                    {member.company.name}
                  </span>
                  <span className="text-base text-[var(--yobell-accent)]">
                    {member.department} · {member.role}
                  </span>
                </button>
              ))
            )}
          </div>
          <button
            type="button"
            onClick={() => setStep("idle")}
            className="kiosk-btn-secondary mx-auto w-full max-w-xs"
          >
            {t(lang, "back")}
          </button>
        </div>
      )}

      {step === "visitorInfo" && (
        <div className="flex flex-col gap-6">
          <h2 className="kiosk-heading text-center text-4xl">
            {t(lang, "visitorInfo")}
          </h2>
          <div className="kiosk-card space-y-5 p-8">
            <div>
              <label className="mb-2 block text-lg font-semibold">
                {t(lang, "companyName")}
              </label>
              <input
                type="text"
                value={state.visitorCompany}
                onChange={(e) =>
                  setState((s) => ({ ...s, visitorCompany: e.target.value }))
                }
                className="kiosk-input"
              />
            </div>
            <div>
              <label className="mb-2 block text-lg font-semibold">
                {t(lang, "yourName")} *
              </label>
              <input
                type="text"
                value={state.visitorName}
                onChange={(e) =>
                  setState((s) => ({ ...s, visitorName: e.target.value }))
                }
                className="kiosk-input"
              />
            </div>
            <div>
              <label className="mb-2 block text-lg font-semibold">
                {t(lang, "phoneOptional")}
              </label>
              <input
                type="tel"
                value={state.visitorPhone}
                onChange={(e) =>
                  setState((s) => ({ ...s, visitorPhone: e.target.value }))
                }
                className="kiosk-input"
              />
            </div>
            <div>
              <label className="mb-2 block text-lg font-semibold">
                {t(lang, "purposeOptional")}
              </label>
              <input
                type="text"
                value={state.purpose}
                onChange={(e) =>
                  setState((s) => ({ ...s, purpose: e.target.value }))
                }
                className="kiosk-input"
              />
            </div>
            <label className="flex cursor-pointer items-start gap-4 rounded-xl border-2 border-[var(--yobell-border)] p-5">
              <input
                type="checkbox"
                checked={state.privacyConsent}
                onChange={(e) =>
                  setState((s) => ({ ...s, privacyConsent: e.target.checked }))
                }
                className="mt-1 h-6 w-6 shrink-0 accent-teal-600"
              />
              <div>
                <span className="text-lg font-semibold">
                  {t(lang, "privacyConsent")}
                </span>
                <p className="mt-1 text-base text-[var(--yobell-muted)]">
                  {privacyNotice}
                </p>
              </div>
            </label>
            {formError && (
              <p className="text-center text-lg text-red-500">{formError}</p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep("host")}
              className="kiosk-btn-secondary flex-1"
            >
              {t(lang, "back")}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!state.visitorName.trim()) {
                  setFormError(t(lang, "required"));
                  return;
                }
                if (!state.privacyConsent) {
                  setFormError(t(lang, "privacyConsent"));
                  return;
                }
                setFormError("");
                setStep("photo");
              }}
              className="kiosk-btn-primary flex-1"
            >
              {t(lang, "next")}
            </button>
          </div>
        </div>
      )}

      {step === "photo" && (
        <CameraCapture
          language={lang}
          onCapture={(photoData) => {
            setState((s) => ({ ...s, photoData }));
            setStep("confirm");
          }}
          onSkip={() => setStep("confirm")}
        />
      )}

      {step === "confirm" && (
        <div className="flex flex-col gap-8">
          <h2 className="kiosk-heading text-center text-4xl">
            {t(lang, "confirmTitle")}
          </h2>
          <div className="kiosk-card divide-y divide-[var(--yobell-border)] p-8 text-xl">
            <ConfirmRow label={t(lang, "confirmType")} value={state.visitorType ? visitorTypeLabel(lang, state.visitorType) : ""} />
            <ConfirmRow label={t(lang, "confirmHost")} value={state.hostStaffName ?? ""} />
            <ConfirmRow label={t(lang, "confirmCompany")} value={state.visitorCompany || "—"} />
            <ConfirmRow label={t(lang, "confirmVisitor")} value={state.visitorName} />
            {state.visitorPhone && (
              <ConfirmRow label={t(lang, "confirmPhone")} value={state.visitorPhone} />
            )}
            {state.purpose && (
              <ConfirmRow label={t(lang, "confirmPurpose")} value={state.purpose} />
            )}
            {state.photoData && (
              <div className="flex items-center gap-4 pt-4">
                <span className="font-semibold text-[var(--yobell-muted)]">写真</span>
                <img
                  src={state.photoData}
                  alt="Visitor"
                  className="h-20 w-20 rounded-xl object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep("visitorInfo")}
              className="kiosk-btn-secondary flex-1"
            >
              {t(lang, "back")}
            </button>
            <button
              type="button"
              onClick={submitVisit}
              className="kiosk-btn-primary flex-1"
            >
              {t(lang, "callHost")}
            </button>
          </div>
        </div>
      )}

      {step === "waiting" && (
        <div className="flex flex-col items-center gap-10 py-8 text-center">
          <StatusIcon status={visitStatus} />
          <div className="space-y-4">
            <h2 className="kiosk-heading text-4xl">
              {t(lang, "waitingTitle")}
            </h2>
            <p className="max-w-2xl text-2xl leading-relaxed text-[var(--yobell-muted)]">
              {visitStatus === "no_response"
                ? fallbackMsg
                : waitingMessage(lang, visitStatus)}
            </p>
          </div>
          {visitStatus === "pending" && (
            <div className="text-lg text-[var(--yobell-muted)]">
              {Math.max(0, 60 - waitSeconds)}s
            </div>
          )}
          {(visitStatus !== "pending" || waitSeconds >= 60) && (
            <button
              type="button"
              onClick={resetKiosk}
              className="kiosk-btn-primary w-full max-w-lg"
            >
              {t(lang, "returnHome")}
            </button>
          )}
        </div>
      )}
    </KioskLayout>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <span className="font-semibold text-[var(--yobell-muted)]">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "from-blue-400 to-blue-600",
    accepted: "from-green-400 to-green-600",
    please_wait: "from-amber-400 to-amber-600",
    declined: "from-red-400 to-red-600",
    no_response: "from-gray-400 to-gray-600",
  };

  return (
    <div
      className={`flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br shadow-2xl ${
        colors[status] ?? colors.pending
      } ${status === "pending" ? "animate-pulse-ring" : ""}`}
    >
      {status === "accepted" ? (
        <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : status === "declined" || status === "no_response" ? (
        <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </div>
  );
}
