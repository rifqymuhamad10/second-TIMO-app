import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "high" | "medium" | "low" | "todo" | "inprogress" | "done" | "default";
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider border-nb-2 select-none";

  const variants = {
    high: "bg-nb-red text-white",
    medium: "bg-nb-yellow text-nb-ink",
    low: "bg-nb-green text-nb-ink",
    todo: "bg-gray-300 text-nb-ink",
    inprogress: "bg-nb-blue text-white",
    done: "bg-nb-green text-nb-ink",
    default: "bg-nb-surface text-nb-ink",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
