// authStorage.ts

export interface StoredUser {
  id: string;
  roles: string[];
}

/**
 * Get the currently logged-in user from sessionStorage or localStorage
 * Supports both old (`user_id`) and new (`id`) formats
 */
export function getStoredUser(): StoredUser | null {
  try {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (!userStr || userStr === "undefined") return null;

    const parsed = JSON.parse(userStr);
    const user: StoredUser = {
      id: parsed.id || parsed.user_id || "",
      roles: Array.isArray(parsed.roles) ? parsed.roles : [],
    };
    return user;
  } catch (err) {
    console.error("Failed to parse stored user - authStorage.ts:24", err);
    return null;
  }
}

/**
 * Get the currently logged-in user ID
 */
export function getUserId(): string {
  const user = getStoredUser();
  return user?.id || "";
}

/**
 * Get roles of the currently logged-in user
 */
export function getUserRoles(): string[] {
  const user = getStoredUser();
  return user?.roles || [];
}

/**
 * Save user to sessionStorage or localStorage
 * Accepts both formats
 */
export function saveUser(userObj: { id?: string; user_id?: string; roles: string[] }, useSession = true) {
  const str = JSON.stringify(userObj);
  if (useSession) {
    sessionStorage.setItem("user", str);
  } else {
    localStorage.setItem("user", str);
  }
}

/**
 * Clear stored user (logout)
 */
export function clearUser() {
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
}