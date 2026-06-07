"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Button from "@/components/ui/Button";
import { Snowflake, ShieldCheck, Flame, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const { user, token, logout, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  // Tangani respon 401
  const handle401 = async () => {
    await logout();
  };

  const handlePurchaseFreeze = async () => {
    if (!token) return;

    if ((user?.total_points || 0) < 200) {
      setMessage({ text: "Poin tidak mencukupi untuk membeli Freeze Streak.", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const activeToken = token || localStorage.getItem("token");
      const res = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ itemId: "streak_freeze" }),
      });

      if (res.status === 401) {
        await handle401();
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal membeli item");
      }

      setMessage({ text: "Pembelian berhasil! Freeze Streak telah ditambahkan.", type: "success" });
      await refreshUser();

      setTimeout(() => {
        setMessage(null);
      }, 4000);
    } catch (err: any) {
      setMessage({ text: err.message || "Terjadi kesalahan sistem", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nb-bg text-nb-ink font-body flex">
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Navbar Atas */}
        <Navbar />

        {/* Konten Utama */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          <div className="flex flex-col gap-6">
            <header>
              <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-nb-ink mb-2">
                Toko Hadiah
              </h1>
              <p className="text-nb-ink/80 text-sm sm:text-base font-medium">
                Tukarkan poin yang kamu kumpulkan dengan item menarik.
              </p>
            </header>

            {/* Poin Saya */}
            <div className="bg-nb-yellow p-4 sm:p-6 border-4 border-nb-ink shadow-nb flex items-center justify-between rounded-lg">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-1">Total Poin</h2>
                <div className="text-3xl sm:text-4xl font-black">{user?.total_points || 0}</div>
              </div>
              <div className="bg-white p-3 rounded-full border-4 border-nb-ink">
                <Flame className="w-8 h-8 text-nb-orange" />
              </div>
            </div>

            {/* Notifikasi Pesan */}
            {message && (
              <div
                className={`p-4 border-4 border-nb-ink shadow-nb font-bold flex items-center gap-3 rounded-lg ${
                  message.type === "success" ? "bg-nb-green text-white" : "bg-nb-red text-white"
                }`}
              >
                <Info className="w-6 h-6 flex-shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            {/* Daftar Item */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Item: Freeze Streak */}
              <div className="bg-white border-4 border-nb-ink shadow-nb rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                <div className="bg-nb-blue p-6 flex justify-center items-center border-b-4 border-nb-ink">
                  <Snowflake className="w-16 h-16 text-white" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl font-black">Freeze Streak</h3>
                    <div className="bg-nb-yellow text-xs font-bold px-2 py-1 border-2 border-nb-ink rounded shadow-nb-sm">
                      Aktif: {user?.streak_freeze || 0}
                    </div>
                  </div>
                  <p className="text-sm text-nb-ink/80 mb-4 flex-1">
                    Bekukan streak kamu! Jika kamu lupa mengerjakan tugas hari ini, streak-mu tidak akan hangus.
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-nb-ink/70">Harga:</span>
                      <span className="font-black text-lg text-nb-orange">200 Poin</span>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full justify-center"
                      onClick={handlePurchaseFreeze}
                      disabled={loading || (user?.total_points || 0) < 200}
                    >
                      {loading ? "Memproses..." : "Beli Sekarang"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tempat untuk item lainnya */}
              <div className="bg-nb-bg/50 border-4 border-dashed border-nb-ink/30 rounded-xl flex flex-col justify-center items-center text-center p-6 opacity-70">
                <ShieldCheck className="w-12 h-12 text-nb-ink/40 mb-3" />
                <h3 className="font-display text-lg font-black text-nb-ink/60">Segera Hadir</h3>
                <p className="text-sm text-nb-ink/50 mt-1">Lebih banyak item akan ditambahkan segera!</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigasi Mobile */}
      <MobileNav />
    </div>
  );
}
