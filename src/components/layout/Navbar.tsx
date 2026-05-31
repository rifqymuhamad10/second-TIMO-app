"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Menu, ChevronDown, CheckSquare } from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="w-full bg-nb-yellow border-nb-b h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Kiri: Hamburg & Logo */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 border-nb-2 bg-nb-surface text-nb-ink active:translate-y-0.5 active:shadow-none hover:bg-nb-yellow transition-colors cursor-pointer"
            aria-label="Buka menu samping"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-nb-surface text-nb-ink border-nb-2 px-2 py-1 font-mono font-black text-lg shadow-[2px_2px_0px_#1A1A1A] group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_#1A1A1A] transition-all">
            TI
          </div>
          <span className="font-display font-extrabold text-xl tracking-wider text-nb-ink uppercase">
            TIMO
          </span>
        </Link>
      </div>

      {/* Tengah: Navigasi Desktop */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/dashboard"
          className={`font-display font-extrabold text-sm uppercase tracking-wider py-1 border-b-3 transition-colors ${
            isLinkActive("/dashboard")
              ? "border-nb-ink text-nb-ink"
              : "border-transparent text-nb-ink/70 hover:text-nb-ink"
          }`}
        >
          Beranda
        </Link>
        <Link
          href="/profile"
          className={`font-display font-extrabold text-sm uppercase tracking-wider py-1 border-b-3 transition-colors ${
            isLinkActive("/profile")
              ? "border-nb-ink text-nb-ink"
              : "border-transparent text-nb-ink/70 hover:text-nb-ink"
          }`}
        >
          Profil
        </Link>
      </div>

      {/* Kanan: Profil Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 border-nb-2 bg-nb-surface px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A1A1A] transition-all cursor-pointer"
        >
          <div className="w-5 h-5 rounded-none bg-nb-yellow border-nb-2 flex items-center justify-center text-xs font-black">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="hidden sm:inline">{user?.username || "Pengguna"}</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-nb-surface border-nb shadow-nb-lg z-20 flex flex-col">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-nb-yellow/20 border-nb-b transition-colors font-body font-bold text-sm text-nb-ink uppercase tracking-wide"
              >
                <User className="w-4 h-4" />
                Profil Saya
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-nb-red/10 text-nb-red transition-colors font-body font-bold text-sm uppercase tracking-wide cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
