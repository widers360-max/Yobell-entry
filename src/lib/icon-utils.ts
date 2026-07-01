import type { LucideIcon } from "lucide-react";
import {
  Users,
  Package,
  UserRound,
  Wrench,
  Info,
  Building2,
  MoreHorizontal,
  Calendar,
  Truck,
  Briefcase,
  HelpCircle,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Package,
  UserRound,
  Wrench,
  Info,
  Building2,
  MoreHorizontal,
  Calendar,
  Truck,
  Briefcase,
  HelpCircle,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export function getIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Users;
}

export interface VisitorCardData {
  id: string;
  typeKey: string;
  title: string;
  subtitle: string;
  iconKey: string;
  sortOrder: number;
  active: boolean;
}

export const DEFAULT_VISITOR_CARDS: Omit<VisitorCardData, "id">[] = [
  {
    typeKey: "meeting",
    title: "打ち合わせ",
    subtitle: "担当者との打ち合わせ",
    iconKey: "Users",
    sortOrder: 0,
    active: true,
  },
  {
    typeKey: "delivery",
    title: "配達・宅配",
    subtitle: "荷物のお預かり・お届け",
    iconKey: "Package",
    sortOrder: 1,
    active: true,
  },
  {
    typeKey: "interview",
    title: "面接・面談",
    subtitle: "採用面接・各種面談",
    iconKey: "UserRound",
    sortOrder: 2,
    active: true,
  },
  {
    typeKey: "maintenance",
    title: "工事・点検",
    subtitle: "業者様はこちら",
    iconKey: "Wrench",
    sortOrder: 3,
    active: true,
  },
  {
    typeKey: "reception",
    title: "ご案内・受付",
    subtitle: "総合案内・受付",
    iconKey: "Info",
    sortOrder: 4,
    active: true,
  },
  {
    typeKey: "tour",
    title: "会社見学",
    subtitle: "見学希望の方はこちら",
    iconKey: "Building2",
    sortOrder: 5,
    active: true,
  },
  {
    typeKey: "other",
    title: "その他",
    subtitle: "上記以外のご用件",
    iconKey: "MoreHorizontal",
    sortOrder: 6,
    active: true,
  },
];
