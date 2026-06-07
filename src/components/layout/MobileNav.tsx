"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, SlidersHorizontal, Plus, Timer, Store } from "lucide-react";

interface MobileNavProps {
  onOpenSidebar?: () => void;
  onOpenAddTask?: () => void;
}

export default function MobileNav({ onOpenSidebar = () => {}, onOpenAddTask = () => {} }: MobileNavProps) {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={onOpenAddTask}
        className="lg:hidden fixed bottom-20 right-6 z-40 w-14 h-14 bg-nb-yellow text-nb-ink border-nb shadow-nb hover:shadow-nb-lg active:translate-y-1 active:shadow-none flex items-center justify-center cursor-pointer transition-all"
        aria-label="Tambah tugas baru"
        id="fab-add-task"
      >
        <Plus className="w-8 h-8 stroke-[3]" />
      </button>

      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-nb-surface border-nb-t h-16 flex items-center justify-around px-4 shadow-[0_-4px_0px_#1A1A1A]/5">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center w-16 h-full font-display font-extrabold text-[10px] uppercase tracking-wide transition-colors ${
            isLinkActive("/dashboard") ? "text-nb-ink" : "text-nb-ink/50"
          }`}
        >
          <Home className={`w-5 h-5 mb-1 ${isLinkActive("/dashboard") ? "stroke-[2.5]" : "stroke-[2]"}`} />
          Beranda
        </Link>

        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center w-16 h-full font-display font-extrabold text-[10px] uppercase tracking-wide text-nb-ink/50 hover:text-nb-ink cursor-pointer"
        >
          <SlidersHorizontal className="w-5 h-5 mb-1 stroke-[2]" />
          Filter
        </button>

        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center w-16 h-full font-display font-extrabold text-[10px] uppercase tracking-wide transition-colors ${
            isLinkActive("/shop") ? "text-nb-ink" : "text-nb-ink/50"
          }`}
        >
          <Store className={`w-5 h-5 mb-1 ${isLinkActive("/shop") ? "stroke-[2.5]" : "stroke-[2]"}`} />
          Toko
        </Link>

        <Link
          href="/pomodoro"
          className={`flex flex-col items-center justify-center w-16 h-full font-display font-extrabold text-[10px] uppercase tracking-wide transition-colors ${
            isLinkActive("/pomodoro") ? "text-nb-ink" : "text-nb-ink/50"
          }`}
        >
          <Timer className={`w-5 h-5 mb-1 ${isLinkActive("/pomodoro") ? "stroke-[2.5]" : "stroke-[2]"}`} />
          Pomodoro
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center w-16 h-full font-display font-extrabold text-[10px] uppercase tracking-wide transition-colors ${
            isLinkActive("/profile") ? "text-nb-ink" : "text-nb-ink/50"
          }`}
        >
          <User className={`w-5 h-5 mb-1 ${isLinkActive("/profile") ? "stroke-[2.5]" : "stroke-[2]"}`} />
          Profil
        </Link>
      </nav>
    </>
  );
}
