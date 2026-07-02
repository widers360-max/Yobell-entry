"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, RefreshCw, Database } from "lucide-react";
import { AdminCard, Btn, Badge } from "./ui";
import { useAdminI18n } from "./AdminI18nProvider";
import { APP_VERSION } from "@/lib/types";

export function SystemSection({
  dbStatus,
  onMessage,
  onRefresh,
}: {
  dbStatus: string;
  onMessage: (msg: string, type?: "success" | "error") => void;
  onRefresh: () => void;
}) {
  const { t } = useAdminI18n();
  const [resetting, setResetting] = useState(false);
  const isDev = process.env.NODE_ENV === "development";
  const dbOk = dbStatus === "connected";

  async function resetSeed() {
    if (!confirm(t("confirm_resetSeed"))) return;
    setResetting(true);
    const res = await fetch("/api/admin/reset-seed", { method: "POST" });
    const data = await res.json();
    setResetting(false);
    if (!res.ok) {
      onMessage(data.error ?? t("msg_resetFailed"), "error");
      return;
    }
    onMessage(data.message ?? t("msg_resetSuccess"));
    onRefresh();
  }

  return (
    <div className="admin-page-stack">
      <div className="grid gap-g3 lg:grid-cols-2">
        <AdminCard title={t("system_appInfo")}>
          <dl className="admin-status-list">
            <div className="admin-status-row">
              <dt>{t("system_version")}</dt>
              <dd className="font-bold">YOBELL Entry v{APP_VERSION}</dd>
            </div>
            <div className="admin-status-row">
              <dt>{t("system_environment")}</dt>
              <dd>{process.env.NODE_ENV ?? "development"}</dd>
            </div>
            <div className="admin-status-row">
              <dt>{t("dash_database")}</dt>
              <dd className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <Badge color={dbOk ? "green" : "red"}>{dbStatus}</Badge>
              </dd>
            </div>
          </dl>
        </AdminCard>

        <AdminCard title={t("system_quickLinks")}>
          <div className="grid gap-g2">
            <Link href="/" target="_blank">
              <Btn variant="secondary" className="w-full justify-start">
                <ExternalLink className="h-4 w-4" />
                {t("system_openKiosk")}
              </Btn>
            </Link>
            <Link href="/staff" target="_blank">
              <Btn variant="secondary" className="w-full justify-start">
                <ExternalLink className="h-4 w-4" />
                {t("system_openStaff")}
              </Btn>
            </Link>
            <Link href="/health" target="_blank">
              <Btn variant="secondary" className="w-full justify-start">
                <ExternalLink className="h-4 w-4" />
                {t("system_openHealth")}
              </Btn>
            </Link>
          </div>
        </AdminCard>

        {isDev && (
          <AdminCard title={t("system_devTools")} className="lg:col-span-2">
            <p className="mb-g3 text-sm text-yobell-muted">{t("system_devToolsDesc")}</p>
            <Btn variant="danger" onClick={resetSeed} disabled={resetting}>
              <RefreshCw className={`h-4 w-4 ${resetting ? "animate-spin" : ""}`} />
              {resetting ? t("system_resetting") : t("system_resetSeed")}
            </Btn>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
