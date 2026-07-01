import { sendVisitNotificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

type VisitWithStaff = {
  id: string;
  visitorName: string;
  visitorCompany: string | null;
  visitorType: string;
  inputMethod: string;
  createdAt: Date;
  photoData: string | null;
  hostStaff: {
    name: string;
    email: string | null;
  };
};

export async function notifyHostStaffForVisit(visit: VisitWithStaff): Promise<void> {
  const email = visit.hostStaff.email?.trim();
  if (!email) {
    await prisma.visit.update({
      where: { id: visit.id },
      data: {
        notificationSent: false,
        notificationError: "Staff email not set",
      },
    });
    console.log("[YOBELL notify] No staff email for visit", visit.id);
    return;
  }

  const result = await sendVisitNotificationEmail({
    visitId: visit.id,
    to: email,
    staffName: visit.hostStaff.name,
    visitorName: visit.visitorName,
    visitorCompany: visit.visitorCompany,
    visitorType: visit.visitorType,
    inputMethod: visit.inputMethod,
    createdAt: visit.createdAt,
    hasPhoto: !!visit.photoData,
  });

  await prisma.visit.update({
    where: { id: visit.id },
    data: {
      notificationSent: result.sent,
      notificationError: result.error ?? null,
    },
  });
}
