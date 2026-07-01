"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { AdminCard, AdminInput, AdminTextarea, Btn } from "./ui";
import { KioskPreview } from "./KioskPreview";
import type { KioskSettings, VisitorCardRecord } from "@/lib/types";

export function BrandingSection({
  settings,
  cards,
  onSave,
}: {
  settings: KioskSettings;
  cards: VisitorCardRecord[];
  onSave: (data: Partial<KioskSettings>) => Promise<void>;
}) {
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

  const fields: { key: keyof KioskSettings; label: string; type?: string }[] = [
    { key: "companyDisplayName", label: "会社表示名" },
    { key: "brandName", label: "ブランド名" },
    { key: "logoUrl", label: "ロゴ URL" },
    { key: "heroImageUrl", label: "ヒーロー画像 URL" },
    { key: "heroVideoUrl", label: "ヒーロー動画 URL" },
    { key: "heroTitle", label: "ヒーロータイトル" },
    { key: "heroSubtitle", label: "ヒーローサブタイトル" },
    { key: "primaryColor", label: "プライマリカラー", type: "color" },
    { key: "accentColor", label: "アクセントカラー", type: "color" },
    { key: "fallbackMessage", label: "フォールバックメッセージ" },
    { key: "privacyNotice", label: "プライバシー通知文" },
    { key: "retentionDays", label: "ログ保持日数", type: "number" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <AdminCard
        title="キオスクブランディング設定"
        action={
          <Btn onClick={handleSave} disabled={saving} size="sm">
            <Save className="h-4 w-4" />
            {saving ? "保存中..." : "保存"}
          </Btn>
        }
      >
        <div className="space-y-4">
          {fields.map((f) =>
            f.key === "fallbackMessage" || f.key === "privacyNotice" || f.key === "heroSubtitle" ? (
              <AdminTextarea
                key={f.key}
                label={f.label}
                rows={2}
                value={String(form[f.key] ?? "")}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            ) : (
              <AdminInput
                key={f.key}
                label={f.label}
                type={f.type ?? "text"}
                value={String(form[f.key] ?? "")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [f.key]:
                      f.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
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
