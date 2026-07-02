"use client";

import { Check, Clock, Loader2, X } from "lucide-react";
import { KioskActionBar, PremiumButton } from "@/components/kiosk";
import {
  normalizeStaffStatus,
  staffInitials,
  staffStatusLabel,
  staffStatusTone,
} from "@/lib/staff-utils";
import { t, waitingMessage, type TranslationKey } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import type {
  NotificationProgressStep,
  WaitingHostInfo,
} from "@/lib/waiting-utils";

interface WaitingScreenProps {
  language: Language;
  visitStatus: string;
  waitSeconds: number;
  fallbackMessage: string;
  host: WaitingHostInfo | null;
  progressSteps: NotificationProgressStep[];
  notificationSent: boolean;
  notificationError: string | null;
  onReturnReception: () => void;
  onSelectOtherHost: () => void;
  onCallAgain: () => void;
  isCallingAgain?: boolean;
}

export function WaitingScreen({
  language,
  visitStatus,
  waitSeconds,
  fallbackMessage,
  host,
  progressSteps,
  notificationSent,
  notificationError,
  onReturnReception,
  onSelectOtherHost,
  onCallAgain,
  isCallingAgain = false,
}: WaitingScreenProps) {
  const isPending = visitStatus === "pending";
  const isAccepted = visitStatus === "accepted";
  const isTerminal =
    visitStatus === "declined" ||
    visitStatus === "no_response" ||
    visitStatus === "accepted" ||
    visitStatus === "please_wait";

  const titleKey = (() => {
    switch (visitStatus) {
      case "accepted":
        return "waitingAccepted" as const;
      case "please_wait":
        return "waitingPleaseWait" as const;
      case "declined":
        return "waitingDeclined" as const;
      case "no_response":
        return "waitingNoResponse" as const;
      default:
        return "waitingTitle" as const;
    }
  })();

  const statusMessage =
    visitStatus === "no_response"
      ? fallbackMessage
      : waitingMessage(language, visitStatus);

  const showNotifyBanner =
    notificationSent || Boolean(notificationError);

  return (
    <div className="waiting-screen flex flex-col items-center gap-g4 py-g2">
      <WaitingPulse status={visitStatus} />

      <div className="waiting-status-copy text-center" key={visitStatus} role="status" aria-live="polite">
        <h2 className="kiosk-heading text-3xl md:text-4xl">
          {t(language, titleKey)}
        </h2>
        <p className="mt-g2 text-lg text-yobell-muted md:text-xl">
          {isPending
            ? t(language, "waitingSubtitle")
            : statusMessage}
        </p>
        {isPending && (
          <p className="mt-g1 text-sm tabular-nums text-yobell-gold">
            {t(language, "waitingCountdown", { seconds: Math.max(0, 60 - waitSeconds) })}
          </p>
        )}
      </div>

      {host && (
        <div className="waiting-host-card w-full max-w-2xl">
          <div className="staff-card-avatar waiting-host-avatar">
            <span>{staffInitials(host.name)}</span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xl font-bold text-yobell-navy md:text-2xl">{host.name}</p>
            <p className="mt-0.5 text-base text-yobell-muted">{host.companyName}</p>
            {(host.department || host.role) && (
              <p className="mt-g1 text-sm font-medium text-yobell-gold md:text-base">
                {[host.department, host.role].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <span
            className={`staff-status-badge staff-status-${staffStatusTone(
              normalizeStaffStatus(host.staffStatus),
            )}`}
          >
            {staffStatusLabel(language, host.staffStatus)}
          </span>
        </div>
      )}

      <div className="waiting-progress w-full max-w-2xl">
        <p className="mb-g2 text-center text-sm font-semibold uppercase tracking-[0.14em] text-yobell-muted">
          {t(language, "waitingProgressTitle")}
        </p>
        <ol className="flex flex-col gap-g2">
          {progressSteps.map((step) => (
            <ProgressRow key={step.id} language={language} step={step} />
          ))}
        </ol>

        {showNotifyBanner && (
          <p
            className={`mt-g2 text-center text-sm font-medium ${
              notificationSent ? "text-yobell-success" : "text-yobell-danger"
            }`}
          >
            {notificationSent
              ? t(language, "notifyEmailSent")
              : t(language, "notifyEmailFailed")}
          </p>
        )}
      </div>

      <div className="waiting-actions w-full max-w-2xl">
        {isTerminal ? (
          <PremiumButton
            fullWidth
            variant={isAccepted ? "success" : "primary"}
            onClick={onReturnReception}
          >
            {t(language, "returnHome")}
          </PremiumButton>
        ) : (
          <>
            <KioskActionBar
              backLabel={t(language, "waitingReturnReception")}
              onBack={onReturnReception}
              secondaryLabel={t(language, "waitingSelectOtherHost")}
              onSecondary={onSelectOtherHost}
              layout="stack"
            />
            <PremiumButton
              fullWidth
              variant="secondary"
              visualState={isCallingAgain ? "loading" : "default"}
              onClick={onCallAgain}
            >
              {t(language, "waitingCallAgain")}
            </PremiumButton>
          </>
        )}
      </div>
    </div>
  );
}

function WaitingPulse({ status }: { status: string }) {
  const tone =
    status === "accepted"
      ? "success"
      : status === "please_wait"
        ? "warning"
        : status === "declined" || status === "no_response"
          ? "muted"
          : "pending";

  return (
    <div className={`waiting-pulse waiting-pulse-${tone}`} aria-hidden>
      <span className="waiting-pulse-ring waiting-pulse-ring-1" />
      <span className="waiting-pulse-ring waiting-pulse-ring-2" />
      <span className="waiting-pulse-ring waiting-pulse-ring-3" />
      <div className={`waiting-pulse-core ${status === "accepted" ? "waiting-success-icon" : ""}`}>
        {status === "accepted" ? (
          <Check className="h-12 w-12 text-white waiting-success-check" strokeWidth={2.5} />
        ) : status === "declined" || status === "no_response" ? (
          <X className="h-12 w-12 text-white" strokeWidth={2.5} />
        ) : (
          <Clock className="h-12 w-12 text-white" strokeWidth={2} />
        )}
      </div>
    </div>
  );
}

function ProgressRow({
  language,
  step,
}: {
  language: Language;
  step: NotificationProgressStep;
}) {
  const labelKey = `waitingStep_${step.id}` as TranslationKey;
  const label = t(language, labelKey);

  return (
    <li
      key={`${step.id}-${step.state}`}
      className={`waiting-progress-row waiting-progress-${step.state}`}
    >
      <span className="waiting-progress-icon" aria-hidden>
        {step.state === "success" ? (
          <Check className="h-5 w-5" strokeWidth={2.5} />
        ) : step.state === "failed" ? (
          <X className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
      </span>
      <span className="flex-1 text-left text-base font-semibold text-yobell-navy">
        {label}
      </span>
      <span className="text-xs font-bold uppercase tracking-wide text-yobell-muted">
        {t(language, `progress_${step.state}` as TranslationKey)}
      </span>
    </li>
  );
}
