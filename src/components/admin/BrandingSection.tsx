"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { AdminCard, AdminInput, AdminTextarea, Btn } from "./ui";
import { KioskPreview } from "./KioskPreview";
import { useAdminI18n } from "./AdminI18nProvider";
import type { AdminTranslationKey } from "@/lib/admin-i18n";
import type { KioskSettings, VisitorCardRecord } from "@/lib/types";

const FIELD_KEYS: { key: keyof KioskSettings; labelKey: AdminTranslationKey; type?: string }[] = [
  { key: "companyDisplayName", labelKey: "field_companyDisplayName" },
  { key: "brandName", labelKey: "field_brandName" },
  { key: "logoUrl", labelKey: "field_logoUrl" },
  { key: "heroImageUrl", labelKey: "field_heroImageUrl" },
  { key: "heroVideoUrl", labelKey: "field_heroVideoUrl" },
  { key: "heroTitle", labelKey: "field_heroTitle" },
  { key: "heroSubtitle", labelKey: "field_heroSubtitle" },
  { key: "primaryColor", labelKey: "field_primaryColor", type: "color" },
  { key: "accentColor", labelKey: "field_accentColor", type: "color" },
  { key: "fallbackMessage", labelKey: "field_fallbackMessage" },
  { key: "privacyNotice", labelKey: "field_privacyNotice" },
  { key: "retentionDays", labelKey: "field_retentionDays", type: "number" },
];

export function BrandingSection({
  settings,
  cards,
  onSave,
}: {
  settings: KioskSettings;
  cards: VisitorCardRecord[];
  onSave: (data: Partial<KioskSettings>) => Promise<void>;
}) {
  const { t } = useAdminI18n();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  async function handleSave() {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <AdminCard
        title={t("branding_title")}
        action={
          <Btn onClick={handleSave} disabled={saving} size="sm">
            <Save className="h-4 w-4" />
            {saving ? t("saving") : t("save")}
          </Btn>
        }
      >
        <div className="space-y-4">
          {FIELD_KEYS.map((f) =>
            f.key === "fallbackMessage" || f.key === "privacyNotice" || f.key === "heroSubtitle" ? (
              <AdminTextarea
                key={f.key}
                label={t(f.labelKey)}
                rows={2}
                value={String(form[f.key] ?? "")}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            ) : (
              <AdminInput
                key={f.key}
                label={t(f.labelKey)}
                type={f.type ?? "text"}
                value={String(form[f.key] ?? "")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [f.key]:
                      f.type === "number" ? Number(e.target.value) : e.target.value,
                  })
                }
              />
            )
          )}
        </div>
      </AdminCard>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <KioskPreview settings={form} cards={cards} />
      </div>
    </div>
  );
}
