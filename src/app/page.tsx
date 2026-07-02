"use client";

import { useState, useEffect, useCallback } from "react";
import { KioskLayout } from "@/components/KioskLayout";
import { KioskHomeScreen } from "@/components/KioskHomeScreen";
import { CallMethodScreen } from "@/components/CallMethodScreen";
import { CameraCapture } from "@/components/CameraCapture";
import { HostSelectionScreen } from "@/components/HostSelectionScreen";
import { WaitingScreen } from "@/components/WaitingScreen";
import {
  KioskActionBar,
  KioskStepTransition,
  StepHeader,
} from "@/components/kiosk";
import {
  buildNotificationProgress,
  parseVisitSnapshot,
  resolveWaitingHost,
  type WaitingVisitSnapshot,
} from "@/lib/waiting-utils";
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
import { t, visitorTypeLabel } from "@/lib/i18n";
import { useKioskIdleTimeout } from "@/lib/use-kiosk-idle-timeout";

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
  idleTimeoutSeconds: KIOSK_SHOWROOM_DEFAULTS.idleTimeoutSeconds,
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
  const [waitingVisit, setWaitingVisit] = useState<WaitingVisitSnapshot | null>(null);
  const [isCallingAgain, setIsCallingAgain] = useState(false);
  const [homeActive, setHomeActive] = useState(false);

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
      setWaitingVisit(parseVisitSnapshot(visit));
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

  const resetKiosk = useCallback(() => {
    setHomeActive(false);
    setStep("idle");
    setState((s) => ({
      ...INITIAL_KIOSK_STATE,
      language: s.language,
    }));
    setSearchQuery("");
    setVisitStatus("pending");
    setWaitSeconds(0);
    setWaitingVisit(null);
    setFormError("");
  }, []);

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
    setWaitingVisit(parseVisitSnapshot(visit));
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
      hostDepartment: member.department,
      hostRole: member.role,
      hostStaffStatus: member.staffStatus ?? "available",
    }));
    setStep("callMethod");
  }

  function handleSelectOtherHost() {
    setStep("host");
    setVisitStatus("pending");
    setWaitSeconds(0);
    setWaitingVisit(null);
    setState((s) => ({
      ...s,
      visitId: null,
      hostStaffId: null,
      hostStaffName: null,
      hostCompanyName: null,
      hostDepartment: null,
      hostRole: null,
      hostStaffStatus: null,
    }));
  }

  async function handleCallAgain() {
    if (!state.visitId) return;
    setIsCallingAgain(true);
    try {
      await fetch(`/api/visits/${state.visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending", respondedAt: null }),
      });
      setVisitStatus("pending");
      setWaitSeconds(0);
      const res = await fetch(`/api/visits/${state.visitId}`);
      if (res.ok) {
        const visit = await res.json();
        setWaitingVisit(parseVisitSnapshot(visit));
      }
    } finally {
      setIsCallingAgain(false);
    }
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

  const handleIdleTimeout = useCallback(() => {
    if (
      step === "waiting" &&
      (visitStatus === "pending" ||
        visitStatus === "please_wait" ||
        visitStatus === "accepted")
    ) {
      return;
    }
    if (step === "idle") {
      setHomeActive(false);
      return;
    }
    resetKiosk();
  }, [step, visitStatus, resetKiosk]);

  const lang = state.language;
  const kioskSettings = settings ?? DEFAULT_SETTINGS;
  const idleSeconds = kioskSettings.idleTimeoutSeconds ?? 60;

  useKioskIdleTimeout({
    idleSeconds,
    onTimeout: handleIdleTimeout,
  });
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
        isActive={homeActive}
        onActivate={() => setHomeActive(true)}
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
          onBack={() => {
            setStep("idle");
            setHomeActive(true);
          }}
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
        <WaitingScreen
          language={lang}
          visitStatus={visitStatus}
          waitSeconds={waitSeconds}
          fallbackMessage={fallbackMsg}
          host={resolveWaitingHost(waitingVisit, state.hostStaffName ? {
            name: state.hostStaffName,
            companyName: state.hostCompanyName ?? "",
            department: state.hostDepartment ?? "",
            role: state.hostRole ?? "",
            staffStatus: state.hostStaffStatus ?? "available",
          } : null)}
          progressSteps={buildNotificationProgress(
            waitingVisit,
            visitStatus,
            Boolean(state.visitId),
          )}
          notificationSent={waitingVisit?.notificationSent ?? false}
          notificationError={waitingVisit?.notificationError ?? null}
          onReturnReception={resetKiosk}
          onSelectOtherHost={handleSelectOtherHost}
          onCallAgain={() => void handleCallAgain()}
          isCallingAgain={isCallingAgain}
        />
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
