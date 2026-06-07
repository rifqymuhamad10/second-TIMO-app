import React from "react";

interface PomodoroRingProps {
  progress: number; // 0 to 100
  sessionType: "focus" | "break";
}

export default function PomodoroRing({ progress, sessionType }: PomodoroRingProps) {
  const barColor = sessionType === "focus" ? "bg-nb-ink" : "bg-nb-ink";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-2 mt-4">
      <div className="flex justify-between font-mono font-bold text-xs uppercase tracking-wider text-nb-ink/70">
        <span>Kemajuan Sesi</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-nb-surface border-nb shadow-nb h-8 overflow-hidden relative">
        <div
          className={`${barColor} h-full transition-all duration-500 ease-out border-r-3 border-nb-ink`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
