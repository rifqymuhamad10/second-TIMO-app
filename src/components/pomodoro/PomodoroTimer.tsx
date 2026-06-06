"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PomodoroRing from "./PomodoroRing";
import Button from "../ui/Button";
import { Play, Pause, RotateCcw, Settings, Check, Volume2, AlertCircle, Flame, Coffee } from "lucide-react";

interface PomodoroSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

interface SavedState {
  timeLeft: number;
  isRunning: boolean;
  sessionType: "focus" | "break";
  activeTaskId: number | null;
  focusSessionCount: number;
  savedAt: number;
}

interface PomodoroTimerProps {
  onSessionTypeChange?: (type: "focus" | "break") => void;
}

export default function PomodoroTimer({ onSessionTypeChange }: PomodoroTimerProps) {
  const { token, user } = useAuth();

  // Settings
  const [settings, setSettings] = useState<PomodoroSettings>({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [inputFocus, setInputFocus] = useState(25);
  const [inputShortBreak, setInputShortBreak] = useState(5);
  const [inputLongBreak, setInputLongBreak] = useState(15);

  // States
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus");

  useEffect(() => {
    if (onSessionTypeChange) {
      onSessionTypeChange(sessionType);
    }
  }, [sessionType, onSessionTypeChange]);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [activeTaskTitle, setActiveTaskTitle] = useState<string | null>(null);
  const [focusSessionCount, setFocusSessionCount] = useState(0);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Ref untuk interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Muat Settings dari localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem("timo-pomodoro-settings");
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSettings(parsed);
        setInputFocus(parsed.focusDuration);
        setInputShortBreak(parsed.shortBreakDuration);
        setInputLongBreak(parsed.longBreakDuration);
        // Jika timer belum berjalan, set timeLeft ke focusDuration baru
        if (!isRunning && sessionType === "focus") {
          setTimeLeft(parsed.focusDuration * 60);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Ambil activeTaskId dari localStorage
    const storedTaskId = localStorage.getItem("timo-active-task-id");
    if (storedTaskId) {
      const tid = Number(storedTaskId);
      setActiveTaskId(tid);
      fetchTaskTitle(tid);
    }
  }, []);

  // 2. Fetch Task Title jika ada activeTaskId
  const fetchTaskTitle = async (tid: number) => {
    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(`/api/tasks`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (res.ok) {
        const result = await res.json();
        const found = result.data.find((t: any) => t.id === tid);
        if (found) {
          setActiveTaskTitle(found.title);
        } else {
          setActiveTaskTitle("Tugas Tidak Ditemukan");
        }
      }
    } catch (e) {
      console.error("Gagal memuat judul tugas:", e);
    }
  };

  // 3. Muat Sesi/Timer State dari localStorage (agar tidak reset saat refresh)
  useEffect(() => {
    const storedState = localStorage.getItem("timo-pomodoro-state");
    if (storedState) {
      try {
        const parsed: SavedState = JSON.parse(storedState);
        
        // Cek jika timer sedang berjalan di sesi sebelumnya
        let calculatedTimeLeft = parsed.timeLeft;
        if (parsed.isRunning) {
          const elapsedSeconds = Math.floor((Date.now() - parsed.savedAt) / 1000);
          calculatedTimeLeft = Math.max(0, parsed.timeLeft - elapsedSeconds);
        }

        setSessionType(parsed.sessionType);
        setFocusSessionCount(parsed.focusSessionCount);
        setActiveTaskId(parsed.activeTaskId);

        if (parsed.activeTaskId) {
          fetchTaskTitle(parsed.activeTaskId);
        }

        if (calculatedTimeLeft <= 0 && parsed.isRunning) {
          // Sesi berakhir ketika halaman ditutup/reloaded
          setTimeLeft(0);
          setIsRunning(false);
          handleSessionCompleteOffline(parsed.sessionType, parsed.activeTaskId, parsed.focusSessionCount);
        } else {
          setTimeLeft(calculatedTimeLeft);
          setIsRunning(parsed.isRunning);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 4. Sinkronisasi state ke localStorage ketika ada perubahan
  useEffect(() => {
    const saveState = () => {
      const state: SavedState = {
        timeLeft,
        isRunning,
        sessionType,
        activeTaskId,
        focusSessionCount,
        savedAt: Date.now(),
      };
      localStorage.setItem("timo-pomodoro-state", JSON.stringify(state));
    };
    saveState();
  }, [timeLeft, isRunning, sessionType, activeTaskId, focusSessionCount]);

  // 5. Update title document
  useEffect(() => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    const formatted = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    const statusLabel = sessionType === "focus" ? "Fokus" : "Istirahat";
    document.title = `[${formatted}] ${statusLabel} | TIMO`;

    return () => {
      document.title = "TIMO — Task & Interaction Management Organizer";
    };
  }, [timeLeft, sessionType]);

  // 6. Timer interval loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, sessionType, activeTaskId, focusSessionCount]);

  // Mainkan suara beep neubrutalist
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Beep 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.3);

      // Beep 2
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 300);
    } catch (e) {
      console.error(e);
    }
  };

  const showNotification = (title: string, body: string) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
      });
    }
  };

  // Kirim sesi selesai ke API
  const saveSessionToDb = async (type: "focus" | "break", duration: number, taskId: number | null) => {
    setSaveLoading(true);
    setSaveMessage(null);
    try {
      const activeToken = token || localStorage.getItem("token");
      const started = new Date(Date.now() - duration * 60 * 1000).toISOString();
      const finished = new Date().toISOString();

      const res = await fetch("/api/pomodoro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          task_id: taskId,
          session_type: type,
          duration_minutes: duration,
          started_at: started,
          finished_at: finished,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan sesi Pomodoro");
      }

      setSaveMessage("Sesi fokus berhasil disimpan!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setSaveMessage("Gagal menyimpan sesi ke server.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle ketika sesi selesai saat online (interaktif)
  const handleSessionComplete = async () => {
    playBeep();
    
    const nextSessionType = sessionType === "focus" ? "break" : "focus";
    const completedTaskId = activeTaskId;
    
    if (sessionType === "focus") {
      const newCount = focusSessionCount + 1;
      setFocusSessionCount(newCount);
      
      showNotification("Sesi Fokus Selesai!", "Hebat! Waktunya istirahat sejenak.");
      
      // Simpan sesi fokus ke database
      await saveSessionToDb("focus", settings.focusDuration, completedTaskId);

      // Tentukan apakah break panjang atau pendek
      if (newCount % 4 === 0) {
        setSessionType("break");
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setSessionType("break");
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      showNotification("Waktu Istirahat Selesai!", "Mari kembali fokus mengerjakan tugas.");
      setSessionType("focus");
      setTimeLeft(settings.focusDuration * 60);
    }
  };

  // Handle sesi selesai saat offline (ketika kalkulasi deteksi selesai saat page closed)
  const handleSessionCompleteOffline = async (type: "focus" | "break", taskId: number | null, count: number) => {
    const nextSessionType = type === "focus" ? "break" : "focus";
    
    if (type === "focus") {
      const newCount = count + 1;
      setFocusSessionCount(newCount);
      await saveSessionToDb("focus", settings.focusDuration, taskId);
      
      if (newCount % 4 === 0) {
        setSessionType("break");
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setSessionType("break");
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setSessionType("focus");
      setTimeLeft(settings.focusDuration * 60);
    }
  };

  // Aksi-aksi tombol
  const startTimer = async () => {
    // Minta permission notifikasi
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (sessionType === "focus") {
      setTimeLeft(settings.focusDuration * 60);
    } else {
      if (focusSessionCount % 4 === 0 && focusSessionCount > 0) {
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    }
  };

  // Simpan setelan baru
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings: PomodoroSettings = {
      focusDuration: Number(inputFocus),
      shortBreakDuration: Number(inputShortBreak),
      longBreakDuration: Number(inputLongBreak),
    };
    
    setSettings(newSettings);
    localStorage.setItem("timo-pomodoro-settings", JSON.stringify(newSettings));
    
    // Reset timer ke durasi baru
    setIsRunning(false);
    if (sessionType === "focus") {
      setTimeLeft(newSettings.focusDuration * 60);
    } else {
      if (focusSessionCount % 4 === 0 && focusSessionCount > 0) {
        setTimeLeft(newSettings.longBreakDuration * 60);
      } else {
        setTimeLeft(newSettings.shortBreakDuration * 60);
      }
    }

    setShowSettings(false);
  };

  // Batalkan tugas aktif
  const clearActiveTask = () => {
    localStorage.removeItem("timo-active-task-id");
    setActiveTaskId(null);
    setActiveTaskTitle(null);
  };

  // Format Waktu MM:SS
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Persentase kemajuan progress bar
  const totalDuration =
    sessionType === "focus"
      ? settings.focusDuration * 60
      : (focusSessionCount % 4 === 0 && focusSessionCount > 0
          ? settings.longBreakDuration * 60
          : settings.shortBreakDuration * 60);

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 md:p-10 max-w-2xl mx-auto bg-nb-surface border-nb shadow-nb-lg">
      
      {/* Header Info Tugas Aktif */}
      <div className="w-full text-center mb-6">
        {activeTaskTitle ? (
          <div className="inline-flex items-center gap-2 border-nb-2 bg-nb-bg px-4 py-1.5 shadow-[2px_2px_0px_#1A1A1A] text-xs font-bold uppercase tracking-wider text-nb-ink">
            <span>Fokus tugas: <strong>{activeTaskTitle}</strong></span>
            <button
              onClick={clearActiveTask}
              className="text-nb-red font-black text-xs hover:underline border-l-2 border-nb-ink/20 pl-2 ml-1 cursor-pointer"
            >
              Hapus
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 border-nb-2 bg-nb-bg/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-nb-ink/50">
            <span>Timer Standalone (Tidak terikat tugas)</span>
          </div>
        )}
      </div>

      {/* Sesi status & Badge sesi */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <span className="font-display font-black text-xl md:text-2xl uppercase tracking-widest text-nb-ink border-b-3 border-nb-ink pb-1 flex items-center gap-2">
          {sessionType === "focus" ? (
            <>
              <Flame className="w-5 h-5 text-nb-red fill-nb-red" />
              <span>Sesi Fokus</span>
            </>
          ) : (
            <>
              <Coffee className="w-5 h-5 text-nb-blue fill-nb-blue/20" />
              <span>Sesi Istirahat</span>
            </>
          )}
        </span>
        <span className="font-mono text-xs font-bold text-nb-ink/65 uppercase tracking-wider">
          Sesi fokus selesai hari ini: {focusSessionCount}
        </span>
      </div>

      {/* Timer Countdown */}
      <div className="font-display font-black text-7xl sm:text-8xl md:text-9xl text-nb-ink tracking-tight select-none mb-4 tabular-nums">
        {formatTime(timeLeft)}
      </div>

      {/* Progress Bar Ring */}
      <div className="w-full mb-8">
        <PomodoroRing progress={progress} sessionType={sessionType} />
      </div>

      {/* Pesan Sukses / Error Sesi Simpan */}
      {saveMessage && (
        <div className="flex items-center gap-2 bg-nb-green/15 border-nb-2 border-nb-green px-4 py-2 text-xs font-bold uppercase text-nb-green tracking-wide mb-6">
          <Volume2 className="w-4 h-4 animate-bounce" />
          {saveMessage}
        </div>
      )}

      {/* Panel Aksi */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        {!isRunning ? (
          <Button
            variant="primary"
            onClick={startTimer}
            className="flex items-center gap-2 px-6 h-12 uppercase font-display font-extrabold text-sm tracking-wider"
          >
            <Play className="w-4 h-4 stroke-[3]" />
            Mulai Fokus
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={pauseTimer}
            className="flex items-center gap-2 px-6 h-12 uppercase font-display font-extrabold text-sm tracking-wider"
          >
            <Pause className="w-4 h-4 stroke-[3]" />
            Jeda
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={resetTimer}
          className="flex items-center gap-2 px-4 h-12 border-nb-2"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="h-12 w-12 border-nb-2 bg-nb-surface text-nb-ink shadow-[2px_2px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
          aria-label="Pengaturan Pomodoro"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Settings Custom Durations */}
      {showSettings && (
        <div className="fixed inset-0 bg-nb-ink/60 z-50 flex items-center justify-center p-4">
          <div className="bg-nb-surface border-nb shadow-nb-lg p-6 w-full max-w-sm flex flex-col gap-5">
            <h3 className="font-display font-black text-lg text-nb-ink uppercase tracking-wider border-b-2 border-nb-ink/10 pb-2">
              Pengaturan Durasi
            </h3>

            <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-bold text-nb-ink uppercase">
                  Fokus (Menit)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={inputFocus}
                  onChange={(e) => setInputFocus(Number(e.target.value))}
                  className="bg-nb-surface text-nb-ink border-nb-2 p-2.5 font-mono text-sm focus:outline-none focus:border-nb-blue transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-bold text-nb-ink uppercase">
                  Istirahat Pendek (Menit)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={inputShortBreak}
                  onChange={(e) => setInputShortBreak(Number(e.target.value))}
                  className="bg-nb-surface text-nb-ink border-nb-2 p-2.5 font-mono text-sm focus:outline-none focus:border-nb-blue transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-bold text-nb-ink uppercase">
                  Istirahat Panjang (Menit)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={inputLongBreak}
                  onChange={(e) => setInputLongBreak(Number(e.target.value))}
                  className="bg-nb-surface text-nb-ink border-nb-2 p-2.5 font-mono text-sm focus:outline-none focus:border-nb-blue transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-nb-ink/10 pt-4 mt-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowSettings(false)}
                >
                  Batal
                </Button>
                <Button variant="primary" type="submit" className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
