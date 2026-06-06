"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Skeleton from "../ui/Skeleton";
import { Flame, Hourglass, Trophy, BarChart3 } from "lucide-react";

interface PomodoroStatsData {
  totalSessions: number;
  totalMinutes: number;
  topTask: { title: string; count: number } | null;
  dailyChartData: { label: string; count: number }[];
}

export default function PomodoroStats() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<PomodoroStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const activeToken = token || localStorage.getItem("token");
        const res = await fetch("/api/pomodoro", {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal memuat statistik");
        }

        const result = await res.json();
        setStats(result.data.stats);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat data statistik Pomodoro");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="bg-nb-surface border-nb shadow-nb-lg p-6 md:p-8 flex flex-col gap-6">
        <Skeleton variant="text" className="w-1/3 h-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton variant="rect" className="h-24" />
          <Skeleton variant="rect" className="h-24" />
          <Skeleton variant="rect" className="h-24" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-nb-surface border-nb shadow-nb-lg p-6 text-center text-nb-ink/50 font-bold uppercase tracking-wider text-xs">
        ⚠️ {error || "Gagal memuat statistik Pomodoro"}
      </div>
    );
  }

  const maxVal = Math.max(...stats.dailyChartData.map((d) => d.count), 1);

  return (
    <section className="bg-nb-surface border-nb shadow-nb-lg p-6 md:p-8">
      <h3 className="font-display font-black text-xl uppercase tracking-wider text-nb-ink mb-6 border-b-3 border-nb-ink pb-2 flex items-center gap-2">
        <Flame className="w-6 h-6 text-nb-red fill-nb-red" />
        Statistik Pomodoro
      </h3>

      <div className="flex flex-col gap-8">
        {/* Rincian Angka Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border-nb-2 bg-nb-yellow p-4 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between">
            <div>
              <p className="font-display font-extrabold text-[10px] text-nb-ink/60 uppercase tracking-widest">
                Total Sesi Fokus
              </p>
              <p className="font-display font-black text-3xl text-nb-ink mt-1">
                {stats.totalSessions} 🍅
              </p>
            </div>
            <p className="font-body text-xs text-nb-ink/70 mt-3 border-t border-nb-ink/10 pt-2">
              Sesi 25 menit yang selesai
            </p>
          </div>

          <div className="border-nb-2 bg-nb-green p-4 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between">
            <div>
              <p className="font-display font-extrabold text-[10px] text-nb-ink/60 uppercase tracking-widest">
                Waktu Fokus
              </p>
              <p className="font-display font-black text-3xl text-nb-ink mt-1 flex items-center gap-1.5">
                <Hourglass className="w-6 h-6 text-nb-ink stroke-[2.5]" />
                {stats.totalMinutes} <span className="text-lg font-bold">menit</span>
              </p>
            </div>
            <p className="font-body text-xs text-nb-ink/70 mt-3 border-t border-nb-ink/10 pt-2">
              Akumulasi waktu belajar Anda
            </p>
          </div>

          <div className="border-nb-2 bg-nb-blue p-4 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between text-white">
            <div>
              <p className="font-display font-extrabold text-[10px] text-white/75 uppercase tracking-widest">
                Tugas Paling Fokus
              </p>
              {stats.topTask ? (
                <>
                  <p className="font-display font-black text-xl truncate mt-1 uppercase" title={stats.topTask.title}>
                    {stats.topTask.title}
                  </p>
                  <p className="font-mono text-sm font-bold mt-0.5">
                    {stats.topTask.count} Sesi Fokus
                  </p>
                </>
              ) : (
                <p className="font-body text-sm font-bold mt-2 text-white/80">
                  Belum ada sesi tugas
                </p>
              )}
            </div>
            <p className="font-body text-xs text-white/70 mt-3 border-t border-white/10 pt-2 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              Tugas terselesaikan sesi terbanyak
            </p>
          </div>
        </div>

        {/* Diagram Batang 7 Hari Terakhir */}
        <div className="border-nb bg-nb-bg p-4 sm:p-6 shadow-[4px_4px_0px_#1A1A1A]">
          <h4 className="font-display font-bold text-sm uppercase tracking-wide text-nb-ink mb-6 flex items-center gap-2 border-b-2 border-nb-ink/10 pb-2">
            <BarChart3 className="w-4 h-4 text-nb-ink" />
            Aktivitas 7 Hari Terakhir
          </h4>

          <div className="flex items-end justify-between h-48 border-b-3 border-nb-ink px-2 sm:px-4 gap-2 pt-6">
            {stats.dailyChartData.map((day, idx) => {
              const heightPercent = (day.count / maxVal) * 90; // max 90% height inside bounds
              return (
                <div key={idx} className="flex flex-col items-center flex-grow group max-w-[60px]">
                  <div className="w-full relative flex justify-center items-end" style={{ height: "140px" }}>
                    {day.count > 0 && (
                      <div className="absolute -top-7 bg-nb-ink text-white font-mono font-bold text-[10px] px-1.5 py-0.5 border border-nb-ink shadow-[1px_1px_0px_#1A1A1A]">
                        {day.count}
                      </div>
                    )}
                    <div
                      className="w-full bg-nb-yellow border-t-2 border-x-2 border-nb-ink shadow-[1px_0px_0px_#1A1A1A] group-hover:bg-nb-blue transition-all duration-300"
                      style={{ height: `${heightPercent || 5}%`, minHeight: "4px" }}
                    />
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-nb-ink/70 mt-2 truncate w-full text-center">
                    {day.label.split(" ")[0]}
                  </span>
                  <span className="font-mono text-[8px] text-nb-ink/50 truncate w-full text-center">
                    {day.label.split(" ")[1] || ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
