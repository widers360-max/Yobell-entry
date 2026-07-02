"use client";

import { useState, useEffect, useCallback } from "react";
import { KioskLayout } from "@/components/KioskLayout";
import { KioskHomeScreen } from "@/components/KioskHomeScreen";
import { CallMethodScreen } from "@/components/CallMethodScreen";
import { CameraCapture } from "@/components/CameraCapture";
import { HostSelectionScreen } from "@/components/HostSelectionScreen";
import {
  KioskActionBar,
  KioskStepTransition,
  PremiumButton,
  StepHeader,
} from "@/components/kiosk";
import {
  findReceptionStaff,
  type KioskStaffMember,
} from "@/lib/staff-utils";
import {
  INITIAL_KIOSK_STATE,
  type KioskState,
  type KioskSettings,
  type Language,
  type VisitorType,
  type VisitorCardRecord,
  type InputMethod,
} from "@/lib/types";
import { VISIT_PLACEHOLDER } from "@/lib/visit-constants";
import {
  KIOSK_SHOWROOM_DEFAULTS,
  YOBELL_DEFAULT_ACCENT,
  YOBELL_DEFAULT_PRIMARY,
} from "@/lib/design-system";
import { t, visitorTypeLabel, waitingMessage } from "@/lib/i18n";

type Step =
  | "idle"
  | "host"
  | "callMethod"
  | "visitorInfo"
  | "photo"
  | "confirm"
  | "waiting";

type StaffMember = KioskStaffMember;

const DEFAULT_SETTINGS: KioskSettings = {
  brandName: KIOSK_SHOWROOM_DEFAULTS.brandName,
  tagline: KIOSK_SHOWROOM_DEFAULTS.tagline,
  logoUrl: null,
  welcomeMessage: KIOSK_SHOWROOM_DEFAULTS.welcomeMessage,
  languageDefault: "ja",
  fallbackMessage:
    "担当者が応答できません。お手数ですがお電話またはメールでご連絡ください。",
  privacyNotice:
    "入力された情報は受付対応および来訪記録のために利用されます。",
  heroImageUrl: null,
  heroVideoUrl: null,
  companyDisplayName: KIOSK_SHOWROOM_DEFAULTS.companyDisplayName,
  heroTitle: KIOSK_SHOWROOM_DEFAULTS.heroTitle,
  heroSubtitle: KIOSK_SHOWROOM_DEFAULTS.heroSubtitle,
  primaryColor: YOBELL_DEFAULT_PRIMARY,
  accentColor: YOBELL_DEFAULT_ACCENT,
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
  const [isContactingReception, setIsContactingReception] = useState(false);

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

  async function submitVisit(overrides?: {
    visitorName?: string;
    visitorCompany?: string | null;
    visitorPhone?: string | null;
    purpose?: string | null;
    photoData?: string | null;
    inputMethod?: InputMethod;
  }) {
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorName: overrides?.visitorName ?? state.visitorName,
        visitorCompany:
          overrides?.visitorCompany !== undefined
            ? overrides.visitorCompany
            : state.visitorCompany || null,
        visitorPhone:
          overrides?.visitorPhone !== undefined
            ? overrides.visitorPhone
            : state.visitorPhone || null,
        purpose:
          overrides?.purpose !== undefined
            ? overrides.purpose
            : state.purpose || null,
        visitorType: state.visitorType,
        hostStaffId: state.hostStaffId,
        photoData:
          overrides?.photoData !== undefined
            ? overrides.photoData
            : state.photoData,
        inputMethod: overrides?.inputMethod ?? state.inputMethod ?? "manual",
      }),
    });
    const visit = await res.json();
    if (!res.ok) return;
    setState((s) => ({ ...s, visitId: visit.id }));
    setStep("waiting");
    setWaitSeconds(0);
    setVisitStatus("pending");
  }

  function handleSelectCallMethod(method: InputMethod) {
    setState((s) => ({ ...s, inputMethod: method }));

    if (method === "quick") {
      void submitVisit({
        visitorName: VISIT_PLACEHOLDER.NOT_ENTERED,
        visitorCompany: VISIT_PLACEHOLDER.NOT_ENTERED,
        visitorPhone: "",
        purpose: "",
        photoData: null,
        inputMethod: "quick",
      });
      return;
    }

    if (method === "business_card") {
      setStep("photo");
      return;
    }

    setStep("visitorInfo");
  }

  function submitBusinessCardVisit(photoData: string | null) {
    void submitVisit({
      visitorName: VISIT_PLACEHOLDER.BUSINESS_CARD,
      visitorCompany: VISIT_PLACEHOLDER.BUSINESS_CARD,
      visitorPhone: "",
      purpose: "",
      photoData,
      inputMethod: "business_card",
    });
  }

  function submitManualWithoutInput() {
    void submitVisit({
      visitorName: VISIT_PLACEHOLDER.NOT_ENTERED,
      visitorCompany: VISIT_PLACEHOLDER.NOT_ENTERED,
      visitorPhone: "",
      purpose: "",
      photoData: null,
      inputMethod: "manual",
    });
  }

  function selectHost(member: StaffMember) {
    setState((s) => ({
      ...s,
      hostStaffId: member.id,
      hostStaffName: member.name,
      hostCompanyName: member.company.name,
    }));
    setStep("callMethod");
  }

  const handleContactReception = useCallback(async () => {
    setIsContactingReception(true);
    try {
      const params = new URLSearchParams({ active: "true" });
      const res = await fetch(`/api/staff?${params}`);
      const allStaff: StaffMember[] = await res.json();
      const reception = findReceptionStaff(allStaff);
      if (reception) {
        selectHost(reception);
      }
    } finally {
      setIsContactingReception(false);
    }
  }, []);

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
      <KioskStepTransition stepKey={step}>
      {step === "host" && (
        <HostSelectionScreen
          language={lang}
          visitorType={state.visitorType}
          staff={staff}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectHost={selectHost}
          onContactReception={() => void handleContactReception()}
          onBack={() => setStep("idle")}
          isContactingReception={isContactingReception}
        />
      )}

      {step === "callMethod" && (
        <CallMethodScreen
          language={lang}
          onSelect={handleSelectCallMethod}
          onBack={() => setStep("host")}
        />
      )}

      {step === "visitorInfo" && (
        <div className="flex flex-col gap-g3">
          <StepHeader title={t(lang, "visitorInfo")} />
          <div className="kiosk-card space-y-g3 p-g4">
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
                {t(lang, "yourName")}
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
            <label className="premium-consent-row flex cursor-pointer items-start gap-g2 rounded-yobell-sm border-2 border-yobell-border p-g3 transition-colors duration-touch hover:border-yobell-gold">
              <input
                type="checkbox"
                checked={state.privacyConsent}
                onChange={(e) =>
                  setState((s) => ({ ...s, privacyConsent: e.target.checked }))
                }
                className="mt-1 h-6 w-6 shrink-0 accent-yobell-gold"
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
          <KioskActionBar
            backLabel={t(lang, "back")}
            onBack={() => setStep("callMethod")}
            primaryLabel={t(lang, "next")}
            onPrimary={() => {
              setFormError("");
              setStep("photo");
            }}
            secondaryLabel={t(lang, "skipManualInput")}
            onSecondary={submitManualWithoutInput}
            layout="stack"
          />
        </div>
      )}

      {step === "photo" && (
        <CameraCapture
          language={lang}
          mode={state.inputMethod === "business_card" ? "business_card" : "visitor"}
          onCapture={(photoData) => {
            if (state.inputMethod === "business_card") {
              submitBusinessCardVisit(photoData);
              return;
            }
            setState((s) => ({ ...s, photoData }));
            setStep("confirm");
          }}
          onSkip={() => {
            if (state.inputMethod === "business_card") {
              submitBusinessCardVisit(null);
              return;
            }
            setStep("confirm");
          }}
        />
      )}

      {step === "confirm" && (
        <div className="flex flex-col gap-g4">
          <StepHeader title={t(lang, "confirmTitle")} />
          <div className="kiosk-card divide-y divide-yobell-border p-g4 text-xl">
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
          <KioskActionBar
            backLabel={t(lang, "back")}
            onBack={() =>
              setStep(state.inputMethod === "business_card" ? "callMethod" : "visitorInfo")
            }
            primaryLabel={t(lang, "callHost")}
            onPrimary={() => void submitVisit()}
          />
        </div>
      )}

      {step === "waiting" && (
        <div className="flex flex-col items-center gap-g4 py-g3 text-center">
          <StatusIcon status={visitStatus} />
          <StepHeader
            title={t(lang, "waitingTitle")}
            subtitle={
              visitStatus === "no_response"
                ? fallbackMsg
                : waitingMessage(lang, visitStatus)
            }
          />
          {visitStatus === "pending" && (
            <div className="text-lg tabular-nums text-yobell-muted">
              {Math.max(0, 60 - waitSeconds)}s
            </div>
          )}
          {(visitStatus !== "pending" || waitSeconds >= 60) && (
            <PremiumButton
              fullWidth
              className="max-w-lg"
              variant={visitStatus === "accepted" ? "success" : "primary"}
              onClick={resetKiosk}
            >
              {t(lang, "returnHome")}
            </PremiumButton>
          )}
        </div>
      )}
      </KioskStepTransition>
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
