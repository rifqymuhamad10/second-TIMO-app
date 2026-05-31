"use client";

import React from "react";
import { CheckSquare, AlertCircle, Bookmark, X, SlidersHorizontal } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  setStatus: (status: string) => void;
  priority: string;
  setPriority: (priority: string) => void;
  selectedSubjects: string[];
  toggleSubject: (subject: string) => void;
  availableSubjects: string[];
}

export default function Sidebar({
  isOpen,
  onClose,
  status,
  setStatus,
  priority,
  setPriority,
  selectedSubjects,
  toggleSubject,
  availableSubjects,
}: SidebarProps) {
  const statusOptions = [
    { value: "all", label: "Semua Tugas", icon: CheckSquare },
    { value: "active", label: "Belum & Aktif", icon: SlidersHorizontal },
    { value: "done", label: "Selesai", icon: CheckSquare },
  ];

  const priorityOptions = [
    { value: "all", label: "Semua Prioritas" },
    { value: "high", label: "Tinggi (High)" },
    { value: "medium", label: "Sedang (Medium)" },
    { value: "low", label: "Rendah (Low)" },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-nb-bg text-nb-ink p-6 overflow-y-auto w-64 lg:w-60">
      {/* Header filter mobile */}
      <div className="flex items-center justify-between lg:hidden mb-6">
        <h3 className="font-display font-extrabold uppercase text-base tracking-wider">
          Filter Tugas
        </h3>
        <button
          onClick={onClose}
          className="p-1 border-nb-2 bg-nb-surface text-nb-ink active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* SECTION 1: Status */}
      <div className="mb-8">
        <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-nb-ink/60 mb-4 border-b-2 border-nb-ink/10 pb-1">
          Berdasarkan Status
        </h4>
        <div className="flex flex-col gap-2">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = status === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-bold uppercase tracking-wider border-nb-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-nb-yellow text-nb-ink shadow-[2px_2px_0px_#1A1A1A]"
                    : "bg-nb-surface text-nb-ink hover:bg-nb-yellow/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Prioritas */}
      <div className="mb-8">
        <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-nb-ink/60 mb-4 border-b-2 border-nb-ink/10 pb-1">
          Prioritas
        </h4>
        <div className="flex flex-col gap-2">
          {priorityOptions.map((opt) => {
            const isActive = priority === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                className={`flex items-center justify-between px-3 py-2 text-sm font-bold uppercase tracking-wider border-nb-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-nb-yellow text-nb-ink shadow-[2px_2px_0px_#1A1A1A]"
                    : "bg-nb-surface text-nb-ink hover:bg-nb-yellow/10"
                }`}
              >
                <span>{opt.label}</span>
                {isActive && <div className="w-2.5 h-2.5 bg-nb-ink border-nb-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Mata Kuliah */}
      <div>
        <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-nb-ink/60 mb-4 border-b-2 border-nb-ink/10 pb-1">
          Mata Kuliah
        </h4>
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {availableSubjects.length === 0 ? (
            <p className="text-xs italic text-gray-500">Belum ada mata kuliah</p>
          ) : (
            availableSubjects.map((subject) => {
              const isChecked = selectedSubjects.includes(subject);
              return (
                <label
                  key={subject}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-bold uppercase tracking-wider border-nb-2 cursor-pointer transition-all ${
                    isChecked
                      ? "bg-nb-yellow/20 text-nb-ink shadow-[1px_1px_0px_#1A1A1A]"
                      : "bg-nb-surface text-nb-ink hover:bg-nb-yellow/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSubject(subject)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border-nb-2 flex items-center justify-center ${
                      isChecked ? "bg-nb-yellow" : "bg-nb-surface"
                    }`}
                  >
                    {isChecked && <div className="w-1.5 h-1.5 bg-nb-ink" />}
                  </div>
                  <span className="truncate">{subject}</span>
                </label>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-60 border-nb-r bg-nb-bg h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile (Drawer) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-nb-ink/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer content panel */}
          <div className="relative z-10 w-64 max-w-xs border-nb-r bg-nb-bg shadow-nb-xl h-full flex flex-col animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
