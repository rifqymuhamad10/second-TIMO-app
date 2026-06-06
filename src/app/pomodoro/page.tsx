"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PomodoroPage() {
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus");
  const router = useRouter();

  const bgColor = sessionType === "focus" ? "bg-nb-yellow" : "bg-nb-green";

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-700 flex flex-col pb-24 lg:pb-12`}>
      <Navbar />

      <main className="flex-grow p-6 md:p-8 lg:p-10 w-full max-w-4xl mx-auto flex flex-col justify-center">
        {/* Tombol Kembali ke Beranda */}
        <div className="mb-8 self-start">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 border-nb-2 bg-nb-surface text-nb-ink px-4 py-2 font-display font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </a>
        </div>

        {/* Timer Box Container */}
        <div className="w-full flex justify-center items-center">
          <PomodoroTimer onSessionTypeChange={setSessionType} />
        </div>
      </main>

      {/* Navigasi Mobile */}
      <MobileNav
        onOpenSidebar={() => router.push("/dashboard?action=openSidebar")}
        onOpenAddTask={() => router.push("/dashboard?action=addTask")}
      />
    </div>
  );
}
