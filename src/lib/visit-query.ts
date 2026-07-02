import type { NextRequest } from "next/server";

/** Build Prisma where clause shared by visits list and CSV export. */
export function buildVisitWhereClause(searchParams: URLSearchParams) {
  const status = searchParams.get("status");
  const pending = searchParams.get("pending");
  const q = searchParams.get("q")?.trim();
  const visitorType = searchParams.get("visitorType");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const host = searchParams.get("host")?.trim();

  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    dateFilter.lte = end;
  }

  return {
    ...(status ? { status } : {}),
    ...(pending === "true" ? { status: "pending" } : {}),
    ...(visitorType ? { visitorType } : {}),
    ...(Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}),
    ...(q || host
      ? {
          AND: [
            ...(q
              ? [
                  {
                    OR: [
                      { visitorName: { contains: q } },
                      { visitorCompany: { contains: q } },
                      { purpose: { contains: q } },
                    ],
                  },
                ]
              : []),
            ...(host
              ? [
                  {
                    OR: [
                      { hostStaff: { name: { contains: host } } },
                      {
                        hostStaff: {
                          company: { name: { contains: host } },
                        },
                      },
                    ],
                  },
                ]
              : []),
          ],
        }
      : {}),
  };
}

export function getVisitSearchParams(request: NextRequest) {
  return new URL(request.url).searchParams;
}
