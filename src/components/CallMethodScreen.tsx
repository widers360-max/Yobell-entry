"use client";

import { PhoneCall, Camera, PenLine } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import type { InputMethod } from "@/lib/visit-constants";

interface CallMethodScreenProps {
  language: Language;
  onSelect: (method: InputMethod) => void;
  onBack: () => void;
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
}: CallMethodScreenProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="kiosk-heading text-center text-4xl">
        {t(language, "selectCallMethod")}
      </h2>

      <div className="grid grid-cols-1 gap-5">
        {OPTIONS.map(({ method, titleKey, subtitleKey, icon: Icon }) => (
          <button
            key={method}
            type="button"
            onClick={() => onSelect(method)}
            className="kiosk-card-interactive flex min-h-[140px] items-center gap-6 p-8 text-left"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-yobell-sm bg-yobell-navy text-white shadow-glass">
              <Icon className="h-10 w-10" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-yobell-navy">
                {t(language, titleKey)}
              </p>
              <p className="mt-g1 text-xl leading-relaxed text-yobell-muted">
                {t(language, subtitleKey)}
              </p>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="kiosk-btn-secondary mx-auto w-full max-w-xs"
      >
        {t(language, "back")}
      </button>
    </div>
  );
}
