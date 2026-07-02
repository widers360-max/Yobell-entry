"use client";

import { useEffect, useState } from "react";
import { Mail, Send } from "lucide-react";
import { AdminCard, AdminInput, Btn, Badge } from "./ui";
import { useAdminI18n } from "./AdminI18nProvider";

interface SmtpStatus {
  smtpHostConfigured: boolean;
  smtpUserConfigured: boolean;
  smtpFromConfigured: boolean;
  appBaseUrl: string;
  smtpReady: boolean;
}

export function NotificationSection({
  onMessage,
}: {
  onMessage: (msg: string, type?: "success" | "error") => void;
}) {
  const { t } = useAdminI18n();
  const [status, setStatus] = useState<SmtpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/admin/notification-settings")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  async function sendTest() {
    if (!recipient.trim()) {
      onMessage(t("notify_testEmailRequired"), "error");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipient.trim() }),
      });
      const data = await res.json();

      if (data.fallback) {
        onMessage(t("notify_testFallback"), "error");
        return;
      }

      if (!res.ok || !data.ok || !data.sent) {
        onMessage(data.error ?? t("notify_testFailed"), "error");
        return;
      }

      onMessage(t("notify_testSuccess"));
    } catch {
      onMessage(t("notify_testFailed"), "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminCard title={t("notify_settingsTitle")}>
        {loading ? (
          <p className="text-sm text-slate-500">{t("loading")}</p>
        ) : status ? (
          <dl className="space-y-3 text-sm">
            <StatusRow label="SMTP_HOST" configured={status.smtpHostConfigured} t={t} />
            <StatusRow label="SMTP_USER" configured={status.smtpUserConfigured} t={t} />
            <StatusRow label="SMTP_FROM" configured={status.smtpFromConfigured} t={t} />
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <dt className="text-slate-500">APP_BASE_URL</dt>
              <dd className="font-mono text-xs font-medium text-slate-800">
                {status.appBaseUrl}
              </dd>
            </div>
            <div className="flex items-center justify-between pt-1">
              <dt className="font-medium text-slate-700">{t("notify_smtpReady")}</dt>
              <dd>
                <Badge color={status.smtpReady ? "green" : "amber"}>
                  {status.smtpReady ? t("notify_configuredYes") : t("notify_configuredNo")}
                </Badge>
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-red-600">{t("notify_loadFailed")}</p>
        )}
        <p className="mt-4 text-xs text-slate-400">{t("notify_envHint")}</p>
      </AdminCard>

      <AdminCard title={t("notify_testTitle")}>
        <div className="space-y-4">
          <AdminInput
            label={t("notify_testRecipient")}
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="staff@example.com"
          />
          <Btn onClick={sendTest} disabled={sending || !recipient.trim()} className="w-full">
            <Send className="h-4 w-4" />
            {sending ? t("notify_testSending") : t("notify_testSend")}
          </Btn>
          <p className="text-xs text-slate-500">{t("notify_testDesc")}</p>
        </div>
      </AdminCard>

      <AdminCard title={t("notify_aboutTitle")} className="lg:col-span-2">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-yobell-sm bg-yobell-navy/10 text-yobell-navy">
            <Mail className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{t("notify_aboutDesc")}</p>
        </div>
      </AdminCard>
    </div>
  );
}

function StatusRow({
  label,
  configured,
  t,
}: {
  label: string;
  configured: boolean;
  t: (key: import("@/lib/admin-i18n").AdminTranslationKey) => string;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="font-mono text-xs text-slate-500">{label}</dt>
      <dd>
        <Badge color={configured ? "green" : "gray"}>
          {configured ? t("notify_configuredYes") : t("notify_configuredNo")}
        </Badge>
      </dd>
    </div>
  );
}
