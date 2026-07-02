"use client";

import { Search } from "lucide-react";
import { KioskActionBar, PremiumButton, StepHeader } from "@/components/kiosk";
import { StaffCard } from "@/components/kiosk/StaffCard";
import { groupStaffByCompany, type KioskStaffMember } from "@/lib/staff-utils";
import { t, visitorTypeLabel } from "@/lib/i18n";
import type { Language, VisitorType } from "@/lib/types";

interface HostSelectionScreenProps {
  language: Language;
  visitorType: VisitorType | null;
  staff: KioskStaffMember[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectHost: (member: KioskStaffMember) => void;
  onContactReception: () => void;
  onBack: () => void;
  isContactingReception?: boolean;
}

export function HostSelectionScreen({
  language,
  visitorType,
  staff,
  searchQuery,
  onSearchChange,
  onSelectHost,
  onContactReception,
  onBack,
  isContactingReception = false,
}: HostSelectionScreenProps) {
  const groupedStaff = groupStaffByCompany(staff);
  const hasResults = staff.length > 0;

  return (
    <div className="flex min-h-[70vh] flex-col gap-g3">
      {visitorType && (
        <div className="host-purpose-chip">
          <span className="host-purpose-chip-label">{t(language, "selectedPurpose")}</span>
          <span className="host-purpose-chip-value">
            {visitorTypeLabel(language, visitorType)}
          </span>
        </div>
      )}

      <StepHeader
        title={t(language, "selectHost")}
        subtitle={t(language, "selectHostSub")}
      />

      <div className="host-search-wrap">
        <Search className="host-search-icon" strokeWidth={1.75} aria-hidden />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t(language, "searchPlaceholder")}
          className="host-search-input"
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>

      <div className="host-staff-list flex-1 overflow-y-auto pr-1">
        {!hasResults ? (
          <div className="host-empty-state">
            <p className="text-xl font-semibold text-yobell-navy md:text-2xl">
              {t(language, "noResults")}
            </p>
            <p className="mt-g1 max-w-md text-base text-yobell-muted">
              {t(language, "footerHelpSub")}
            </p>
            <PremiumButton
              variant="primary"
              fullWidth
              className="mt-g3 max-w-md"
              visualState={isContactingReception ? "loading" : "default"}
              onClick={onContactReception}
            >
              {t(language, "contactReception")}
            </PremiumButton>
          </div>
        ) : (
          <div className="flex flex-col gap-g4">
            {groupedStaff.map(([companyName, members]) => (
              <section key={companyName} className="host-company-group">
                <h3 className="host-company-heading">{companyName}</h3>
                <div className="flex flex-col gap-g2">
                  {members.map((member) => (
                    <StaffCard
                      key={member.id}
                      member={member}
                      language={language}
                      onSelect={onSelectHost}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <KioskActionBar backLabel={t(language, "back")} onBack={onBack} />
    </div>
  );
}
