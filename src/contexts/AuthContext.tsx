"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch("/api/users/current", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        setUser(result.data);
        setToken(authToken);
      } else {
        // Token tidak valid atau kedaluwarsa
        logoutState();
      }
    } catch (err) {
      console.error("Gagal mengambil data user saat ini:", err);
      logoutState();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchCurrentUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const logoutState = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    const activeToken = token || localStorage.getItem("token");
    if (activeToken) {
      await fetchCurrentUser(activeToken);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server tidak mengembalikan respons JSON. Harap periksa apakah server berjalan dan konfigurasi database/Supabase di `.env.local` sudah benar.");
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal masuk");
      }

      const authToken = result.data;
      localStorage.setItem("token", authToken);
      setToken(authToken);
      
      // Ambil data user saat ini
      await fetchCurrentUser(authToken);
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    // Registrasi di TIMO Web V2 membuat user baru. Pengguna harus login secara manual setelah mendaftar
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal mendaftar");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    const activeToken = token || localStorage.getItem("token");
    try {
      if (activeToken) {
        await fetch("/api/users/logout", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });
      }
    } catch (err) {
      console.error("Error saat logout di backend:", err);
    } finally {
      logoutState();
      router.push("/login");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
