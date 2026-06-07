import React from "react";
import { Star, TrendingUp } from "lucide-react";

interface PointsCardProps {
  totalPoints: number;
}

export default function PointsCard({ totalPoints }: PointsCardProps) {
  const level = Math.floor(totalPoints / 500) + 1;
  const pointsInCurrentLevel = totalPoints % 500;
  const progressPercentage = (pointsInCurrentLevel / 500) * 100;

  return (
    <div className="bg-nb-yellow border-nb border-nb-ink shadow-nb p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10">
        <Star className="w-32 h-32 stroke-[2]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-nb-ink p-3 border-nb-2 border-nb-ink shadow-nb-sm">
            <Star className="w-6 h-6 stroke-[3] text-nb-yellow" />
          </div>
          <div>
            <p className="font-body font-bold text-xs uppercase tracking-wider text-nb-ink/70">
              Total Poin
            </p>
            <h3 className="font-display font-black text-3xl text-nb-ink tracking-tight">
              {totalPoints.toLocaleString()} ⭐
            </h3>
          </div>
        </div>

        <div className="pt-4 border-t-3 border-nb-ink/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 stroke-[2.5] text-nb-ink/70" />
              <p className="font-body text-sm text-nb-ink/80">
                Level <strong className="font-bold text-nb-ink">{level}</strong>
              </p>
            </div>
            <p className="font-body text-xs text-nb-ink/60">
              {pointsInCurrentLevel}/500
            </p>
          </div>
          
          <div className="w-full h-3 bg-nb-ink/10 border-2 border-nb-ink/30 relative overflow-hidden">
            <div 
              className="h-full bg-nb-ink transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <p className="font-body text-xs text-nb-ink/60 mt-2 text-center">
            {500 - pointsInCurrentLevel} poin lagi ke Level {level + 1}
          </p>
        </div>
      </div>
    </div>
  );
}
