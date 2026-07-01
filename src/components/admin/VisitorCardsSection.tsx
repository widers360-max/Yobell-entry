"use client";

import { useState, useEffect } from "react";
import { Save, ChevronUp, ChevronDown } from "lucide-react";
import { ICON_OPTIONS, getIcon } from "@/lib/icon-utils";
import { AdminCard, AdminInput, AdminSelect, Btn, Badge } from "./ui";
import type { VisitorCardRecord } from "@/lib/types";

export function VisitorCardsSection({
  cards,
  onSave,
  onMessage,
}: {
  cards: VisitorCardRecord[];
  onSave: (cards: VisitorCardRecord[]) => Promise<void>;
  onMessage: (msg: string, type?: "success" | "error") => void;
}) {
  const [form, setForm] = useState(cards);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(cards);
  }, [cards]);

  function updateCard(id: string, patch: Partial<VisitorCardRecord>) {
    setForm((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function moveCard(index: number, dir: -1 | 1) {
    const sorted = [...form].sort((a, b) => a.sortOrder - b.sortOrder);
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;
    const newOrder = sorted.map((c, i) => {
      if (i === index) return { ...c, sortOrder: target };
      if (i === target) return { ...c, sortOrder: index };
      return { ...c, sortOrder: i };
    });
    setForm(newOrder.sort((a, b) => a.sortOrder - b.sortOrder));
  }

  async function handleSave() {
    setSaving(true);
    const withOrder = form.map((c, i) => ({ ...c, sortOrder: i }));
    await onSave(withOrder);
    setSaving(false);
    onMessage("用件カードを保存しました");
  }

  const sorted = [...form].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <AdminCard
      title="来訪用件カード設定"
      action={
        <Btn onClick={handleSave} disabled={saving} size="sm">
          <Save className="h-4 w-4" />
          {saving ? "保存中..." : "一括保存"}
        </Btn>
      }
    >
      <p className="mb-6 text-sm text-slate-500">
        キオスクホーム画面に表示される7枚のカードを編集できます。非アクティブにすると非表示になります。
      </p>
      <div className="space-y-4">
        {sorted.map((card, index) => {
          const Icon = getIcon(card.iconKey);
          return (
            <div
              key={card.id}
              className="flex flex-wrap items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <Icon className="h-6 w-6 text-[#1a2b4b]" strokeWidth={1.75} />
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <AdminInput
                  label="タイトル"
                  value={card.title}
                  onChange={(e) => updateCard(card.id, { title: e.target.value })}
                />
                <AdminInput
                  label="サブタイトル"
                  value={card.subtitle}
                  onChange={(e) => updateCard(card.id, { subtitle: e.target.value })}
                />
                <AdminSelect
                  label="アイコン"
                  value={card.iconKey}
                  onChange={(e) => updateCard(card.id, { iconKey: e.target.value })}
                >
                  {ICON_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </AdminSelect>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={card.active}
                      onChange={(e) => updateCard(card.id, { active: e.target.checked })}
                      className="h-4 w-4 rounded"
                    />
                    表示
                  </label>
                  <Badge color={card.active ? "green" : "gray"}>
                    {card.active ? "有効" : "無効"}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Btn variant="ghost" size="sm" onClick={() => moveCard(index, -1)} disabled={index === 0}>
                  <ChevronUp className="h-4 w-4" />
                </Btn>
                <Btn variant="ghost" size="sm" onClick={() => moveCard(index, 1)} disabled={index === sorted.length - 1}>
                  <ChevronDown className="h-4 w-4" />
                </Btn>
              </div>
            </div>
          );
        })}
      </div>
    </AdminCard>
  );
}
