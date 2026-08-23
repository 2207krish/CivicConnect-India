"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  apiLogin,
  apiLogout,
  apiMe,
  apiRegister,
  apiUpdateProfile,
  apiVerifyEmail,
} from "@/lib/auth-client";
import { seedDemoData } from "@/lib/storage";
import type { Address, PublicUser } from "@/types";

interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: Address;
}

interface AuthContextValue {
  user: PublicUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<PublicUser>;
  register: (input: RegisterInput) => Promise<{
    email: string;
    previewUrl: string | null;
  }>;
  verifyEmail: (input: {
    email: string;
    otp?: string;
    token?: string;
  }) => Promise<PublicUser>;
  logout: () => Promise<void>;
  updateProfile: (patch: {
    name: string;
    phone: string;
    address: Address;
  }) => Promise<PublicUser>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([seedDemoData().catch(() => undefined), apiMe().catch(() => null)])
      .then(([, current]) => {
        if (!active) return;
        setUser(current);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      async login(email, password) {
        const result = await apiLogin(email, password);
        setUser(result.user);
        return result.user;
      },
      async register(input) {
        const result = await apiRegister(input);
        return { email: result.email, previewUrl: result.previewUrl };
      },
      async verifyEmail(input) {
        const result = await apiVerifyEmail(input);
        setUser(result.user);
        return result.user;
      },
      async logout() {
        await apiLogout();
        setUser(null);
      },
      async updateProfile(patch) {
        const result = await apiUpdateProfile(patch);
        setUser(result.user);
        return result.user;
      },
    }),
    [ready, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
