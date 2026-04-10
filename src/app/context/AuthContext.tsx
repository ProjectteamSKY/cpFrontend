import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

/* =======================
   TYPES
======================= */
interface User {
    id: string;       // UUID from backend
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    loginWithToken: (token: string, user: User) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
    isAuthenticated: boolean;
}

/* =======================
   CONTEXT
======================= */
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};

/* =======================
   PROVIDER
======================= */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => {
        const t = sessionStorage.getItem("token");
        return t && t !== "undefined" ? t : null;
    });

    const [user, setUser] = useState<User | null>(() => {
        try {
            const item = sessionStorage.getItem("user");
            if (!item || item === "undefined") return null;
            return JSON.parse(item);
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        setLoading(false);

        console.log("AuthProvider initialized:");
        console.log("Token:", token);
        console.log("User:", user);
    }, [token, user]);

    const loginWithToken = (backendToken: string, backendUser: User) => {
        setToken(backendToken);
        setUser(backendUser);
        sessionStorage.setItem("token", backendToken);
        sessionStorage.setItem("user", JSON.stringify(backendUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${backendToken}`;

        console.log("LoginWithToken called:");
        console.log("Token:", backendToken);
        console.log("User:", backendUser);
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/users/login",
                new URLSearchParams({ email, password })
            );
            console.log("Login response:", res.data);

            // Construct user object from backend response
            const backendUser: User = {
                id: res.data.user_id,
                roles: res.data.roles || [],
            };
            const backendToken = res.data.bearer_token;

            loginWithToken(backendToken, backendUser);

            return { success: true };
        } catch (err: any) {
            console.error("Login failed:", err.response?.data || err);
            return { success: false, message: err.response?.data?.detail || "Login failed" };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        sessionStorage.clear();
        delete axios.defaults.headers.common["Authorization"];

        console.log("Logged out");
    };

    const hasRole = (role: string) => user?.roles?.includes(role) || false;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                loginWithToken,
                logout,
                hasRole,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};