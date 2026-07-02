"use client";

import { useAdminI18n } from "./AdminI18nProvider";

interface TrendPoint {
  date: string;
  count: number;
}

export function VisitorTrendChart({ data }: { data: TrendPoint[] }) {
  const { lang, t } = useAdminI18n();
  const max = Math.max(...data.map((d) => d.count), 1);
  const locale = lang === "ko" ? "ko-KR" : lang === "en" ? "en-US" : "ja-JP";
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="admin-trend-empty">
        <p>{t("dash_trendEmpty")}</p>
      </div>
    );
  }

  return (
    <div className="admin-trend-chart" role="img" aria-label={t("dash_visitTrend")}>
      <div className="admin-trend-bars">
        {data.map((point) => {
          const height = Math.max(8, Math.round((point.count / max) * 100));
          const label = new Date(`${point.date}T12:00:00`).toLocaleDateString(locale, {
            month: "numeric",
            day: "numeric",
            weekday: "short",
          });
          return (
            <div key={point.date} className="admin-trend-bar-col">
              <span className="admin-trend-value">{point.count}</span>
              <div className="admin-trend-bar-track">
                <div
                  className="admin-trend-bar-fill"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="admin-trend-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
