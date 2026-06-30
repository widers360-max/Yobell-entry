export type VisitorTypeKey =
  | "APPOINTMENT"
  | "SALES"
  | "DELIVERY"
  | "CONTRACTOR"
  | "OTHER";

export const VISITOR_TYPES: {
  key: VisitorTypeKey;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    key: "APPOINTMENT",
    label: "アポイントあり",
    description: "事前にお約束のあるお客様",
    icon: "📅",
  },
  {
    key: "SALES",
    label: "営業・ご提案",
    description: "営業やご提案でお越しの方",
    icon: "💼",
  },
  {
    key: "DELIVERY",
    label: "配送・宅配",
    description: "お荷物のお届け",
    icon: "📦",
  },
  {
    key: "CONTRACTOR",
    label: "業者・点検",
    description: "工事・点検・メンテナンス",
    icon: "🔧",
  },
  {
    key: "OTHER",
    label: "その他",
    description: "上記以外のご用件",
    icon: "❓",
  },
];

export type VisitStatusKey =
  | "WAITING"
  | "ACKNOWLEDGED"
  | "ON_THE_WAY"
  | "COMPLETED"
  | "CANCELLED";

export const VISIT_STATUS: Record<
  VisitStatusKey,
  { label: string; color: string }
> = {
  WAITING: { label: "呼び出し中", color: "bg-amber-100 text-amber-800 border-amber-300" },
  ACKNOWLEDGED: { label: "確認済み", color: "bg-blue-100 text-blue-800 border-blue-300" },
  ON_THE_WAY: { label: "対応中", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  COMPLETED: { label: "対応完了", color: "bg-green-100 text-green-800 border-green-300" },
  CANCELLED: { label: "キャンセル", color: "bg-gray-100 text-gray-600 border-gray-300" },
};

export function visitorTypeLabel(key: string): string {
  return VISITOR_TYPES.find((t) => t.key === key)?.label ?? key;
}

export function visitStatusLabel(key: string): string {
  return (VISIT_STATUS as Record<string, { label: string }>)[key]?.label ?? key;
}
