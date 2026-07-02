"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { KioskLayout } from "@/components/KioskLayout";
import { KioskHomeScreen } from "@/components/KioskHomeScreen";
import { CallMethodScreen } from "@/components/CallMethodScreen";
import { CameraCapture } from "@/components/CameraCapture";
import { HostSelectionScreen } from "@/components/HostSelectionScreen";
import { WaitingScreen } from "@/components/WaitingScreen";
import {
  KioskActionBar,
  KioskStepTransition,
  KioskErrorState,
  PremiumSpinner,
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
import { mergeKioskSettings } from "@/lib/kiosk-defaults";
import { t, visitorTypeLabel } from "@/lib/i18n";
import { useKioskIdleTimeout } from "@/lib/use-kiosk-idle-timeout";
import {
  completePendingVisit,
  isTerminalVisitStatus,
  patchVisitStatus,
} from "@/lib/visit-client";

type Step =
  | "idle"
  | "host"
  | "callMethod"
  | "visitorInfo"
  | "photo"
  | "confirm"
  | "waiting";

type StaffMember = KioskStaffMember;

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
  const [bootstrapReady, setBootstrapReady] = useState(false);
  const [bootstrapError, setBootstrapError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [receptionError, setReceptionError] = useState("");
  const visitIdRef = useRef<string | null>(null);
  const visitStatusRef = useRef("pending");

  useEffect(() => {
    visitIdRef.current = state.visitId;
  }, [state.visitId]);

  useEffect(() => {
    visitStatusRef.current = visitStatus;
  }, [visitStatus]);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/visitor-cards").then((r) => r.json()),
    ])
      .then(([settingsData, cardsData]: [KioskSettings, VisitorCardRecord[]]) => {
        setSettings(mergeKioskSettings(settingsData));
        setVisitorCards(cardsData);
        setState((s) => ({
          ...s,
          language: (settingsData.languageDefault as Language) || "ja",
        }));
      })
      .catch(() => setBootstrapError(true))
      .finally(() => setBootstrapReady(true));
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
    if (isTerminalVisitStatus(visitStatus)) return;

    const poll = setInterval(async () => {
      const res = await fetch(`/api/visits/${state.visitId}`);
      if (!res.ok) return;
      const visit = await res.json();
      setVisitStatus(visit.status);
      setWaitingVisit(parseVisitSnapshot(visit));
    }, 2000);

    return () => clearInterval(poll);
  }, [step, state.visitId, visitStatus]);

  useEffect(() => {
    if (step !== "waiting") return;

    const timer = setInterval(() => {
      setWaitSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step !== "waiting" || waitSeconds < 60 || visitStatus !== "pending" || !state.visitId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const ok = await patchVisitStatus(state.visitId!, "no_response");
      if (cancelled || !ok) return;
      const res = await fetch(`/api/visits/${state.visitId}`);
      if (cancelled || !res.ok) return;
      const visit = await res.json();
      setVisitStatus(visit.status);
      setWaitingVisit(parseVisitSnapshot(visit));
    })();

    return () => {
      cancelled = true;
    };
  }, [step, waitSeconds, visitStatus, state.visitId]);

  const resetKiosk = useCallback(() => {
    void completePendingVisit(visitIdRef.current, visitStatusRef.current);
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
    setReceptionError("");
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
    const method = overrides?.inputMethod ?? state.inputMethod ?? "manual";
    if (method === "manual" && !state.privacyConsent) {
      setSubmitError(t(state.language, "privacyConsentRequired"));
      return false;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
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
      if (!res.ok) {
        setSubmitError(t(state.language, "kiosk_submitFailed"));
        return false;
      }
      setState((s) => ({ ...s, visitId: visit.id }));
      setWaitingVisit(parseVisitSnapshot(visit));
      setStep("waiting");
      setWaitSeconds(0);
      setVisitStatus("pending");
      return true;
    } catch {
      setSubmitError(t(state.language, "kiosk_submitFailed"));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectCallMethod(method: InputMethod) {
    setSubmitError("");
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
    if (!state.privacyConsent) {
      setFormError(t(state.language, "privacyConsentRequired"));
      return;
    }
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
    void completePendingVisit(state.visitId, visitStatus);
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
    setReceptionError("");
    try {
      const params = new URLSearchParams({ active: "true" });
      const res = await fetch(`/api/staff?${params}`);
      const allStaff: StaffMember[] = await res.json();
      const reception = findReceptionStaff(allStaff);
      if (reception) {
        selectHost(reception);
      } else {
        setReceptionError(t(state.language, "noResults"));
      }
    } finally {
      setIsContactingReception(false);
    }
  }, [state.language]);

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
  const kioskSettings = settings ?? mergeKioskSettings(null);
  const idleSeconds = kioskSettings.idleTimeoutSeconds ?? 60;

  useKioskIdleTimeout({
    idleSeconds,
    onTimeout: handleIdleTimeout,
  });
  const tagline = kioskSettings.tagline ?? t(lang, "tagline");
  const privacyNotice = kioskSettings.privacyNotice ?? t(lang, "privacyNotice");
  const fallbackMsg = kioskSettings.fallbackMessage ?? t(lang, "waitingFallback");

  const submitOverlay = isSubmitting ? (
    <div className="kiosk-submit-overlay">
      <PremiumSpinner label={t(lang, "kiosk_loading")} size="lg" />
    </div>
  ) : null;

  if (!bootstrapReady) {
    return (
      <div className="kiosk-portrait flex min-h-screen items-center justify-center bg-yobell-bg">
        <PremiumSpinner label={t(lang, "kiosk_loading")} size="lg" />
      </div>
    );
  }

  if (bootstrapError) {
    return (
      <div className="kiosk-portrait flex min-h-screen items-center justify-center bg-yobell-bg px-g4">
        <KioskErrorState
          title={t(lang, "kiosk_errorTitle")}
          message={t(lang, "kiosk_bootstrapFailed")}
          retryLabel={t(lang, "kiosk_retry")}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

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
          receptionError={receptionError}
        />
      )}

      {step === "callMethod" && (
        <CallMethodScreen
          language={lang}
          onSelect={handleSelectCallMethod}
          onBack={() => setStep("host")}
          errorMessage={submitError}
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
            <label
              htmlFor="privacy-consent"
              className="premium-consent-row flex cursor-pointer items-start gap-g2 rounded-yobell-sm border-2 border-yobell-border p-g3 transition-colors duration-touch hover:border-yobell-gold"
            >
              <input
                id="privacy-consent"
                type="checkbox"
                checked={state.privacyConsent}
                onChange={(e) =>
                  setState((s) => ({ ...s, privacyConsent: e.target.checked }))
                }
                className="mt-1 h-6 w-6 shrink-0 accent-yobell-gold"
                aria-describedby="privacy-notice-text"
              />
              <div>
                <span className="text-lg font-semibold">
                  {t(lang, "privacyConsent")}
                </span>
                <p id="privacy-notice-text" className="mt-1 text-base text-[var(--yobell-muted)]">
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
              if (!state.privacyConsent) {
                setFormError(t(lang, "privacyConsentRequired"));
                return;
              }
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
                <span className="font-semibold text-[var(--yobell-muted)]">
                  {t(lang, "confirmPhoto")}
                </span>
                <img
                  src={state.photoData}
                  alt={t(lang, "photoAltVisitor")}
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
            primaryLoading={isSubmitting}
            onPrimary={() => void submitVisit()}
          />
          {submitError && step === "confirm" && (
            <p className="text-center text-lg text-yobell-danger">{submitError}</p>
          )}
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
      {submitOverlay}
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
