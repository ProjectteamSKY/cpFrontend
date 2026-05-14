// authStorage.ts

export interface StoredUser {
  id: string;
  fullname: string;
  email?: string;
  roles: string[];
}

/**
 * Get the currently logged-in user from sessionStorage or localStorage
 */
export function getStoredUser(): StoredUser | null {
  try {
    const userStr =
      sessionStorage.getItem("user") ||
      localStorage.getItem("user");

    if (!userStr || userStr === "undefined") return null;

    const parsed = JSON.parse(userStr);

    const user: StoredUser = {
      id: parsed.id || parsed.user_id || "",
      fullname: parsed.fullname || "", // ✅ Added
      email: parsed.email || "",       // ✅ Added
      roles: Array.isArray(parsed.roles)
        ? parsed.roles
        : [],
    };

    return user;
  } catch (err) {
    console.error(
      "Failed to parse stored user",
      err
    );
    return null;
  }
}

/**
 * Get logged-in user ID
 */
export function getUserId(): string {
  const user = getStoredUser();
  return user?.id || "";
}

/**
 * ✅ Get logged-in user fullname
 */
export function getUserFullname(): string {
  const user = getStoredUser();
  return user?.fullname || "";
}

/**
 * Get logged-in user email
 */
export function getUserEmail(): string {
  const user = getStoredUser();
  return user?.email || "";
}

/**
 * Get roles of the currently logged-in user
 */
export function getUserRoles(): string[] {
  const user = getStoredUser();
  return user?.roles || [];
}

/**
 * Save user to storage
 */
export function saveUser(
  userObj: {
    id?: string;
    user_id?: string;
    fullname?: string;
    email?: string;
    roles: string[];
  },
  useSession = true
) {
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