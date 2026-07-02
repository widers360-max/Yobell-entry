"use client";

import {
  Hash,
  Mail,
  MessageSquare,
  Phone,
  Users,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { TouchRipple } from "./TouchRipple";
import {
  normalizeStaffStatus,
  notificationMethodLabel,
  staffInitials,
  staffStatusLabel,
  staffStatusTone,
  type KioskStaffMember,
} from "@/lib/staff-utils";
import type { Language } from "@/lib/types";

const NOTIFY_ICONS: Record<string, LucideIcon> = {
  email: Mail,
  line_works: MessageSquare,
  slack: Hash,
  teams: Users,
  phone: Phone,
  dashboard: LayoutDashboard,
};

interface StaffCardProps {
  member: KioskStaffMember;
  language: Language;
  onSelect: (member: KioskStaffMember) => void;
}

export function StaffCard({ member, language, onSelect }: StaffCardProps) {
  const status = normalizeStaffStatus(member.staffStatus);
  const tone = staffStatusTone(status);
  const NotifyIcon = NOTIFY_ICONS[member.notificationMethod] ?? Mail;

  return (
    <TouchRipple className="block w-full">
      <button
        type="button"
        onClick={() => onSelect(member)}
        className="staff-card"
      >
        <div className="staff-card-avatar" aria-hidden>
          <span>{staffInitials(member.name)}</span>
        </div>

        <div className="staff-card-body">
          <div className="flex items-start justify-between gap-g2">
            <div className="min-w-0 text-left">
              <p className="truncate text-xl font-bold text-yobell-navy md:text-2xl">
                {member.name}
              </p>
              <p className="mt-0.5 truncate text-base text-yobell-muted">
                {member.company.name}
              </p>
            </div>
            <span className={`staff-status-badge staff-status-${tone}`}>
              {staffStatusLabel(language, status)}
            </span>
          </div>

          <p className="mt-g1 text-left text-sm font-medium text-yobell-gold md:text-base">
            {member.department} · {member.role}
          </p>
        </div>

        <div
          className="staff-card-notify"
          title={notificationMethodLabel(language, member.notificationMethod)}
          aria-label={notificationMethodLabel(language, member.notificationMethod)}
        >
          <NotifyIcon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </button>
    </TouchRipple>
  );
}
