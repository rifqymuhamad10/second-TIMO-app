import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "yellow" | "blue" | "green";
}

export default function StatCard({ title, value, icon: Icon, variant = "yellow" }: StatCardProps) {
  const variants = {
    yellow: "bg-nb-yellow text-nb-ink",
    blue: "bg-nb-blue text-white",
    green: "bg-nb-green text-nb-ink",
  };

  return (
    <div className="w-full bg-nb-surface border-nb shadow-nb p-5 flex items-center justify-between">
      <div>
        <p className="font-display font-extrabold text-xs md:text-sm uppercase tracking-wider text-nb-ink/60 mb-1">
          {title}
        </p>
        <p className="font-display font-black text-3xl md:text-4xl text-nb-ink">
          {value}
        </p>
      </div>

      <div className={`w-12 h-12 border-nb-2 flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] ${variants[variant]}`}>
        <Icon className="w-6 h-6 stroke-[2.5]" />
      </div>
    </div>
  );
}
