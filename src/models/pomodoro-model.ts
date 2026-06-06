import { supabase } from "@/lib/supabaseClient";
import { isMockEnabled, mockDb } from "@/lib/mockDb";

export interface PomodoroSession {
  id?: number;
  user_id: number;
  task_id: number | null;
  session_type: "focus" | "break";
  duration_minutes: number;
  started_at: string;
  finished_at: string;
  created_at?: string;
}

export async function insertPomodoroSession(sessionData: PomodoroSession) {
  if (isMockEnabled) {
    return mockDb.insertPomodoroSession(sessionData);
  }

  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .insert([sessionData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findPomodoroSessionsByUserId(userId: number) {
  if (isMockEnabled) {
    return mockDb.findPomodoroSessionsByUserId(userId);
  }

  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getPomodoroSessionCountsPerTask(userId: number): Promise<Record<number, number>> {
  if (isMockEnabled) {
    const sessions = await mockDb.findPomodoroSessionsByUserId(userId);
    const counts: Record<number, number> = {};
    sessions.forEach((s: any) => {
      if (s.task_id && s.session_type === "focus") {
        counts[s.task_id] = (counts[s.task_id] || 0) + 1;
      }
    });
    return counts;
  }

  // Fetch only completed focus sessions for tasks
  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .select("task_id")
    .eq("user_id", userId)
    .eq("session_type", "focus")
    .not("task_id", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  const counts: Record<number, number> = {};
  if (data) {
    data.forEach((s: any) => {
      const tid = Number(s.task_id);
      counts[tid] = (counts[tid] || 0) + 1;
    });
  }
  return counts;
}
