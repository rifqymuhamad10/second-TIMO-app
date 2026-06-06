"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Edit3, Trash2, CheckCircle2, Circle } from "lucide-react";
import Badge from "../ui/Badge";
import { getSubjectColor } from "@/lib/colors";

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "inprogress" | "done";
  subject: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  pomodoro_count?: number;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  // Tentukan warna latar berdasarkan status dan mata kuliah
  const subColor = getSubjectColor(task.subject);
  
  let bgStyle = subColor.bg;
  if (task.status === "inprogress") {
    bgStyle = "bg-[#E3F2FD]"; // Biru muda
  } else if (task.status === "done") {
    bgStyle = "bg-[#F1F8E9]"; // Hijau muda
  }

  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const checkTimerActive = () => {
      const storedState = localStorage.getItem("timo-pomodoro-state");
      if (storedState) {
        try {
          const parsed = JSON.parse(storedState);
          if (parsed.isRunning && Number(parsed.activeTaskId) === Number(task.id)) {
            setIsTimerActive(true);
            return;
          }
        } catch (e) {}
      }
      setIsTimerActive(false);
    };

    checkTimerActive();

    // Dengarkan perubahan local storage (untuk sinkronisasi antar tab/komponen)
    window.addEventListener("storage", checkTimerActive);
    // Interval check juga untuk mendeteksi perubahan cepat
    const interval = setInterval(checkTimerActive, 1000);

    return () => {
      window.removeEventListener("storage", checkTimerActive);
      clearInterval(interval);
    };
  }, [task.id]);

  const startPomodoroForTask = () => {
    localStorage.setItem("timo-active-task-id", String(task.id));

    let currentCount = 0;
    const storedState = localStorage.getItem("timo-pomodoro-state");
    if (storedState) {
      try {
        const parsed = JSON.parse(storedState);
        currentCount = parsed.focusSessionCount || 0;
      } catch (e) {}
    }

    let focusDuration = 25;
    const storedSettings = localStorage.getItem("timo-pomodoro-settings");
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        focusDuration = parsed.focusDuration || 25;
      } catch (e) {}
    }

    const newState = {
      timeLeft: focusDuration * 60,
      isRunning: true,
      sessionType: "focus",
      activeTaskId: task.id,
      focusSessionCount: currentCount,
      savedAt: Date.now(),
    };
    localStorage.setItem("timo-pomodoro-state", JSON.stringify(newState));

    window.location.href = "/pomodoro";
  };

  // Format tanggal Indonesia
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴 Tinggi";
      case "medium":
        return "🟡 Sedang";
      case "low":
        return "🟢 Rendah";
      default:
        return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "Belum Mulai";
      case "inprogress":
        return "Dikerjakan";
      case "done":
        return "Selesai";
      default:
        return status;
    }
  };

  return (
    <div
      className={`w-full ${bgStyle} border-nb shadow-nb hover:-translate-y-1 hover:shadow-nb-lg transition-all duration-200 flex flex-col justify-between p-5`}
    >
      {/* Atas: Badge Prioritas & Status */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Badge variant={task.priority}>{getPriorityLabel(task.priority)}</Badge>
        
        <button
          onClick={() => onToggleStatus(task)}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider border-nb-2 bg-nb-surface text-nb-ink px-2 py-0.5 hover:-translate-y-0.5 hover:shadow-[1px_1px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          {task.status === "done" ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-nb-green stroke-[3]" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-gray-400 stroke-[3]" />
          )}
          {getStatusLabel(task.status)}
        </button>
      </div>

      {/* Tengah: Judul & Deskripsi */}
      <div className="flex-grow mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-nb-2 ${subColor.accent}`}>
            {task.subject}
          </span>
        </div>
        <h3 className="font-display font-extrabold text-lg text-nb-ink leading-tight mb-2 uppercase break-words">
          {task.title}
        </h3>
        <p className="font-body text-sm text-nb-ink/80 leading-relaxed line-clamp-3 break-words">
          {task.description || "Tidak ada deskripsi."}
        </p>
      </div>

      {/* Bawah: Deadline & Aksi */}
      <div className="border-t-2 border-nb-ink/10 pt-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          {task.pomodoro_count !== undefined && (
            <span className="font-mono font-bold text-xs text-nb-ink flex items-center gap-1" title="Jumlah sesi Pomodoro selesai">
              🍅 ×{task.pomodoro_count}
            </span>
          )}
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-nb-ink/70">
            <Calendar className="w-4 h-4 text-nb-ink/60" />
            {formatDate(task.deadline)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Pomodoro */}
          {isTimerActive ? (
            <button
              onClick={() => window.location.href = "/pomodoro"}
              className="px-2.5 py-2 border-nb-2 bg-nb-red text-white hover:bg-red-600 font-display font-extrabold text-xs uppercase tracking-wider flex items-center gap-1 active:translate-y-0.5 active:shadow-none transition-colors cursor-pointer"
              title="Timer Pomodoro sedang berjalan"
            >
              <span>⏱ Aktif</span>
            </button>
          ) : (
            <button
              onClick={startPomodoroForTask}
              className="px-2.5 py-2 border-nb-2 bg-nb-surface text-nb-ink hover:bg-nb-yellow font-display font-extrabold text-xs uppercase tracking-wider flex items-center gap-1 active:translate-y-0.5 active:shadow-none transition-colors cursor-pointer"
              title="Mulai Sesi Pomodoro untuk tugas ini"
            >
              <span>🍅 Fokus</span>
            </button>
          )}

          {/* Tombol Edit */}
          <button
            onClick={() => onEdit(task)}
            className="p-2 border-nb-2 bg-nb-surface text-nb-ink hover:bg-nb-yellow active:translate-y-0.5 active:shadow-none transition-colors cursor-pointer"
            aria-label="Edit tugas"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          {/* Tombol Hapus */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 border-nb-2 bg-nb-red text-white hover:bg-red-600 active:translate-y-0.5 active:shadow-none transition-colors cursor-pointer"
            aria-label="Hapus tugas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
