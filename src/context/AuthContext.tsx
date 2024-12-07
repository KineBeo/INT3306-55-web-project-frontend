import React, { createContext, useState, useEffect } from "react";
import { login, refreshAccessToken } from "../services/authService";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  fullname: string;
  phone_number: string;
  role: string;
}

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (phone_number: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLogin = async (phone_number: string, password: string) => {
    const response = await login(phone_number, password);
    setUser(response.user);
    setAccessToken(response.access_token);

    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
  };

  const refreshToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
      const response = await refreshAccessToken(refresh_token);
      const new_access_token = response.access_token;
      const new_refresh_token = response.refresh_token;
      localStorage.setItem("access_token", new_access_token);
      localStorage.setItem("refresh_token", new_refresh_token);
      setAccessToken(new_access_token);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!pathname.includes("/auth") && pathname !== "/") {
      if (!access_token && !refresh_token) {
        router.push(`/auth/signin?redirect=${pathname}`);
      }
    }
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login: handleLogin, logout }}>{children}</AuthContext.Provider>
  );
};
