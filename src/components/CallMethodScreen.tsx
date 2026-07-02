"use client";

import { PhoneCall, Camera, PenLine } from "lucide-react";
import { KioskActionBar, PremiumCard, StepHeader } from "@/components/kiosk";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import type { InputMethod } from "@/lib/visit-constants";

interface CallMethodScreenProps {
  language: Language;
  onSelect: (method: InputMethod) => void;
  onBack: () => void;
  errorMessage?: string;
}

const OPTIONS: {
  method: InputMethod;
  titleKey: "callQuick" | "callBusinessCard" | "callManual";
  subtitleKey: "callQuickSub" | "callBusinessCardSub" | "callManualSub";
  icon: typeof PhoneCall;
}[] = [
  {
    method: "quick",
    titleKey: "callQuick",
    subtitleKey: "callQuickSub",
    icon: PhoneCall,
  },
  {
    method: "business_card",
    titleKey: "callBusinessCard",
    subtitleKey: "callBusinessCardSub",
    icon: Camera,
  },
  {
    method: "manual",
    titleKey: "callManual",
    subtitleKey: "callManualSub",
    icon: PenLine,
  },
];

export function CallMethodScreen({
  language,
  onSelect,
  onBack,
  errorMessage,
}: CallMethodScreenProps) {
  return (
    <div className="flex flex-col gap-g3">
      <StepHeader title={t(language, "selectCallMethod")} />

      {errorMessage && (
        <p className="rounded-yobell-sm border border-yobell-danger/30 bg-yobell-danger/5 px-g3 py-g2 text-center text-lg text-yobell-danger">
          {errorMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-g2">
        {OPTIONS.map(({ method, titleKey, subtitleKey, icon }) => (
          <PremiumCard
            key={method}
            layout="horizontal"
            title={t(language, titleKey)}
            subtitle={t(language, subtitleKey)}
            icon={icon}
            onClick={() => onSelect(method)}
            minHeight="8.75rem"
          />
        ))}
      </div>

      <KioskActionBar backLabel={t(language, "back")} onBack={onBack} />
    </div>
  );
}
