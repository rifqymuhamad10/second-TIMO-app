"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, Calendar } from "lucide-react";

interface DeadlineCountdownProps {
  deadlineStr: string;
  status: "todo" | "inprogress" | "done";
}

export default function DeadlineCountdown({ deadlineStr, status }: DeadlineCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "critical" | "overdue">("normal");

  useEffect(() => {
    if (status === "done") {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const parts = deadlineStr.split("-");
      let deadlineDate: Date;

      if (parts.length === 3) {
        // Mengasumsikan batas waktu pengumpulan adalah akhir hari (23:59:59)
        deadlineDate = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
          23,
          59,
          59,
          999
        );
      } else {
        deadlineDate = new Date(deadlineStr);
        deadlineDate.setHours(23, 59, 59, 999);
      }

      const now = new Date();
      const diffMs = deadlineDate.getTime() - now.getTime();

      if (diffMs < 0) {
        // Hitung selisih hari keterlambatan secara matematis
        const diffDays = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
        setUrgency("overdue");
        setTimeLeft(`Terlambat ${diffDays} Hari`);
        return;
      }

      const oneHour = 1000 * 60 * 60;
      const oneDay = oneHour * 24;

      if (diffMs > oneDay) {
        // Sisa waktu > 24 jam: tampilkan hari secara statis
        const diffDays = Math.floor(diffMs / oneDay);
        setUrgency("normal");
        if (diffDays === 1) {
          setTimeLeft("Besok");
        } else {
          setTimeLeft(`${diffDays} Hari Lagi`);
        }
      } else {
        // Sisa waktu <= 24 jam: tampilkan countdown HH:MM:SS
        const hours = Math.floor(diffMs / oneHour);
        const minutes = Math.floor((diffMs % oneHour) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const pad = (num: number) => String(num).padStart(2, "0");
        setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

        // Sisa waktu <= 3 jam masuk kategori kritis (merah berdetak/berdenyut)
        if (hours < 3) {
          setUrgency("critical");
        } else {
          setUrgency("urgent");
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadlineStr, status]);

  if (status === "done" || !timeLeft) return null;

  // Kelas badge bergaya Neo-brutalism
  let badgeClass = "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-nb-2 transition-all duration-300 flex items-center gap-1";

  let UrgencyIcon = Calendar;
  switch (urgency) {
    case "overdue":
      badgeClass += " bg-nb-red text-white border-nb-ink";
      UrgencyIcon = AlertTriangle;
      break;
    case "critical":
      badgeClass += " bg-nb-red text-white border-nb-ink animate-pulse";
      UrgencyIcon = AlertTriangle;
      break;
    case "urgent":
      badgeClass += " bg-nb-yellow text-nb-ink border-nb-ink";
      UrgencyIcon = Clock;
      break;
    case "normal":
    default:
      badgeClass += " bg-nb-surface text-nb-ink/70 border-nb-ink";
      UrgencyIcon = Calendar;
      break;
  }

  return (
    <span className={badgeClass}>
      <UrgencyIcon className="w-3 h-3 flex-shrink-0" />
      <span>{timeLeft}</span>
    </span>
  );
}
