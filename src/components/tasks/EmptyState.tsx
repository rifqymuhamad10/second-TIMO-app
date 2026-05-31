"use client";

import React from "react";
import { Plus } from "lucide-react";
import Button from "../ui/Button";

interface EmptyStateProps {
  onAddTask: () => void;
}

export default function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <div className="w-full bg-nb-surface border-nb p-8 md:p-12 shadow-nb flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8">
      {/* Flat SVG Illustration */}
      <div className="w-40 h-40 mb-6 bg-nb-yellow border-nb shadow-nb flex items-center justify-center">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="text-nb-ink"
        >
          {/* Clipboard body */}
          <rect x="5" y="4" width="14" height="17" />
          {/* Paper lines */}
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="13" y2="17" />
          {/* Clip */}
          <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" fill="#1A1A1A" />
        </svg>
      </div>

      <h3 className="font-display font-extrabold text-xl md:text-2xl text-nb-ink uppercase tracking-wider mb-2">
        Belum ada tugas nih!
      </h3>
      <p className="font-body text-sm md:text-base text-nb-ink/70 mb-8 max-w-sm">
        Yuk, tambahkan tugas pertamamu sekarang agar tidak terlewat deadline kuliah.
      </p>

      <Button variant="primary" onClick={onAddTask} className="flex items-center gap-2">
        <Plus className="w-5 h-5 stroke-[3]" />
        Tambah Tugas Pertama
      </Button>
    </div>
  );
}
