import type { LucideIcon } from "lucide-react";
import {
  Users,
  Package,
  UserRound,
  Wrench,
  Info,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import type { VisitorType } from "./types";

export interface VisitorPurposeCard {
  type: VisitorType;
  icon: LucideIcon;
  subtitleKey: string;
}

export const VISITOR_PURPOSE_CARDS: VisitorPurposeCard[] = [
  { type: "meeting", icon: Users, subtitleKey: "purpose_meeting" },
  { type: "delivery", icon: Package, subtitleKey: "purpose_delivery" },
  { type: "interview", icon: UserRound, subtitleKey: "purpose_interview" },
  { type: "maintenance", icon: Wrench, subtitleKey: "purpose_maintenance" },
  { type: "reception", icon: Info, subtitleKey: "purpose_reception" },
  { type: "tour", icon: Building2, subtitleKey: "purpose_tour" },
  { type: "other", icon: MoreHorizontal, subtitleKey: "purpose_other" },
];

export const MAIN_GRID_CARDS = VISITOR_PURPOSE_CARDS.slice(0, 6);
export const OTHER_CARD = VISITOR_PURPOSE_CARDS[6];
