import { getCurrentUser } from "./users-service";
import {
  insertPomodoroSession,
  findPomodoroSessionsByUserId,
} from "@/models/pomodoro-model";
import { findTaskByIdAndUserId } from "@/models/tasks-model";

export async function getPomodoroHistory(token: string) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }
  return await findPomodoroSessionsByUserId(user.id);
}

export async function savePomodoroSession(token: string, payload: any) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  const { task_id, session_type, duration_minutes, started_at, finished_at } = payload;

  if (!session_type || !duration_minutes || !started_at || !finished_at) {
    throw new Error("Missing required fields");
  }

  if (session_type !== "focus" && session_type !== "break") {
    throw new Error("Invalid session type");
  }

  // If task_id is provided, verify it belongs to user
  let finalTaskId: number | null = null;
  if (task_id) {
    const task = await findTaskByIdAndUserId(Number(task_id), user.id);
    if (task) {
      finalTaskId = Number(task_id);
    }
  }

  const sessionData = {
    user_id: user.id,
    task_id: finalTaskId,
    session_type: session_type as "focus" | "break",
    duration_minutes: Number(duration_minutes),
    started_at,
    finished_at,
  };

  return await insertPomodoroSession(sessionData);
}

export async function getPomodoroStats(token: string) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  const sessions = await findPomodoroSessionsByUserId(user.id);
  const focusSessions = sessions.filter((s: any) => s.session_type === "focus");

  // 1. Total Sesi & Menit
  const totalSessions = focusSessions.length;
  const totalMinutes = focusSessions.reduce((acc: number, s: any) => acc + Number(s.duration_minutes), 0);

  // 2. Tugas Terbanyak
  const taskCounts: Record<number, number> = {};
  focusSessions.forEach((s: any) => {
    if (s.task_id) {
      taskCounts[s.task_id] = (taskCounts[s.task_id] || 0) + 1;
    }
  });

  let topTaskId: number | null = null;
  let topTaskCount = 0;

  Object.entries(taskCounts).forEach(([tid, count]) => {
    if (count > topTaskCount) {
      topTaskCount = count;
      topTaskId = Number(tid);
    }
  });

  let topTaskTitle: string | null = null;
  if (topTaskId) {
    try {
      const task = await findTaskByIdAndUserId(topTaskId, user.id);
      if (task) {
        topTaskTitle = task.title;
      }
    } catch (e) {
      console.error("Gagal mengambil info top task:", e);
    }
  }

  // 3. Statistik 7 Hari Terakhir (Senin - Minggu atau Tanggal)
  const last7Days: { dateStr: string; label: string; count: number }[] = [];
  const daysInIndonesian = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    
    // Format YYYY-MM-DD
    const dateStr = d.toISOString().split("T")[0];
    const label = `${daysInIndonesian[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`;
    
    last7Days.push({
      dateStr,
      label,
      count: 0,
    });
  }

  focusSessions.forEach((s: any) => {
    // Ambil tanggal dari started_at / finished_at
    try {
      const dateOnly = new Date(s.finished_at).toISOString().split("T")[0];
      const match = last7Days.find((day) => day.dateStr === dateOnly);
      if (match) {
        match.count += 1;
      }
    } catch (err) {
      // Abaikan parsing error
    }
  });

  const dailyChartData = last7Days.map((day) => ({
    label: day.label,
    count: day.count,
  }));

  return {
    totalSessions,
    totalMinutes,
    topTask: topTaskTitle ? { title: topTaskTitle, count: topTaskCount } : null,
    dailyChartData,
  };
}
