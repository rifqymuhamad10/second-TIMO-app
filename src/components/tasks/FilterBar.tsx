"use client";

import React from "react";
import { Search, ArrowUpDown } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  // Untuk status filter cepat di mobile
  status: string;
  setStatus: (status: string) => void;
  taskType: string;
  setTaskType: (type: string) => void;
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  status,
  setStatus,
  taskType,
  setTaskType,
}: FilterBarProps) {
  const quickStatusOptions = [
    { value: "all", label: "Semua" },
    { value: "active", label: "Aktif" },
    { value: "done", label: "Selesai" },
  ];

  return (
    <div className="w-full bg-nb-surface border-nb p-4 md:p-5 shadow-nb flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
      {/* Kiri: Search Input */}
      <div className="flex-1 relative">
        <label htmlFor="search-input" className="sr-only">
          Cari Tugas
        </label>
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari tugas di sini..."
          className="w-full bg-nb-bg text-nb-ink border-nb-2 pl-10 pr-4 py-2 text-sm font-body placeholder:text-gray-400 focus:outline-none focus:border-nb-blue h-11"
        />
        <Search className="w-4 h-4 text-nb-ink/50 absolute left-3.5 top-3.5" />
      </div>

      {/* Tengah: Quick status filter (Hanya muncul di mobile/tablet sebagai tab cepat) */}
      <div className="flex lg:hidden items-center gap-1 border-2 border-nb-ink p-1 bg-nb-bg h-11 self-start md:self-auto">
        {quickStatusOptions.map((opt) => {
          const isActive = status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                isActive ? "bg-nb-yellow border-nb-2 text-nb-ink shadow-[1px_1px_0px_#1A1A1A]" : "text-nb-ink/60 hover:text-nb-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Tengah: Quick Task Type filter (Desktop & Mobile) */}
      <div className="flex items-center gap-1 border-2 border-nb-ink p-1 bg-nb-bg h-11 self-start md:self-auto">
        {[
          { value: "all", label: "Semua" },
          { value: "individual", label: "Individu" },
          { value: "group", label: "Kelompok" },
        ].map((opt) => {
          const isActive = taskType === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTaskType(opt.value)}
              className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                isActive ? "bg-nb-blue border-nb-2 text-white shadow-[1px_1px_0px_#1A1A1A]" : "text-nb-ink/60 hover:text-nb-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Kanan: Sort Dropdown */}
      <div className="flex items-center gap-2 h-11">
        <div className="border-nb-2 bg-nb-bg px-3 h-full flex items-center text-nb-ink/60">
          <ArrowUpDown className="w-4 h-4" />
        </div>
        <label htmlFor="sort-select" className="sr-only">
          Urutkan Berdasarkan
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-nb-bg text-nb-ink border-nb-2 border-l-0 -ml-2.5 px-4 h-full text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer focus:border-nb-blue"
        >
          <option value="deadline-asc">📅 Tenggat Terdekat</option>
          <option value="deadline-desc">📅 Tenggat Terjauh</option>
          <option value="created-desc">🆕 Terbaru Dibuat</option>
          <option value="created-asc">⏳ Terlama Dibuat</option>
        </select>
      </div>
    </div>
  );
}
