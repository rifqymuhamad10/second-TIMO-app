import React from "react";
import { Flame, Trophy } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <div className="bg-nb-orange border-nb border-nb-ink shadow-nb p-6 relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 opacity-10">
        <Flame className="w-32 h-32 stroke-[2]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-nb-ink p-3 border-nb-2 border-nb-ink shadow-nb-sm">
            <Flame className="w-6 h-6 stroke-[3] text-nb-orange" />
          </div>
          <div>
            <p className="font-body font-bold text-xs uppercase tracking-wider text-nb-ink/70">
              Streak Hari Ini
            </p>
            <h3 className="font-display font-black text-3xl text-nb-ink tracking-tight">
              {currentStreak} 🔥
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t-3 border-nb-ink/20">
          <Trophy className="w-5 h-5 stroke-[2.5] text-nb-ink/70" />
          <p className="font-body text-sm text-nb-ink/80">
            Rekor Terbaik: <strong className="font-bold text-nb-ink">{longestStreak} hari</strong>
          </p>
        </div>

        {currentStreak === longestStreak && currentStreak > 0 && (
          <div className="mt-3 bg-nb-ink/10 border-2 border-nb-ink/20 p-2 text-center">
            <p className="font-body font-bold text-xs uppercase text-nb-ink">
              🎉 Rekor Baru!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
