"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-nb-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-nb-2 bg-nb-yellow flex items-center justify-center font-mono font-black text-xl shadow-nb mx-auto animate-bounce mb-4">
          TI
        </div>
        <p className="font-display font-extrabold uppercase tracking-widest text-sm text-nb-ink/60">
          Memuat TIMO...
        </p>
      </div>
    </div>
  );
}
