export type AuthRole = "admin" | "staff";

export const AUTH_STORAGE_KEYS: Record<AuthRole, string> = {
  admin: "yobell_admin_unlocked",
  staff: "yobell_staff_unlocked",
};

export function isUnlocked(role: AuthRole): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_STORAGE_KEYS[role]) === "true";
}

export function setUnlocked(role: AuthRole): void {
  sessionStorage.setItem(AUTH_STORAGE_KEYS[role], "true");
}

export function clearUnlock(role: AuthRole): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEYS[role]);
}

export async function verifyPassword(
  role: AuthRole,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/check-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, password }),
    });
    const data = await res.json();
    if (!data || typeof data.ok !== "boolean") {
      return { ok: false, error: "Invalid response" };
    }
    return data;
  } catch {
    return { ok: false, error: "Network error" };
  }
}
