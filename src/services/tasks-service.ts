import { getCurrentUser } from "./users-service";
import {
  findTasksByUserId,
  findTaskById,
  insertTask,
  updateTaskById,
  deleteTaskById,
  updateTask,
} from "@/models/tasks-model";
import { processTaskCompletion } from "./gamification-service";
import { findTaskMember } from "@/models/task-members-model";
import { getPomodoroSessionCountsPerTask } from "@/models/pomodoro-model";

export async function getTasksForUser(token: string) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }
  const tasks = await findTasksByUserId(user.id);
  try {
    const counts = await getPomodoroSessionCountsPerTask(user.id);
    return tasks.map((task: any) => ({
      ...task,
      pomodoro_count: counts[task.id] || 0,
    }));
  } catch (err) {
    console.error("Gagal mendapatkan jumlah sesi Pomodoro:", err);
    return tasks.map((task: any) => ({
      ...task,
      pomodoro_count: 0,
    }));
  }
}

export async function createTaskForUser(token: string, payload: any) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  const { title, description, priority, status, subject, deadline, is_group } = payload;

  if (!title || !subject || !deadline) {
    throw new Error("Missing required fields (title, subject, deadline)");
  }

  const validPriorities = ["high", "medium", "low"];
  const validStatuses = ["todo", "inprogress", "done"];

  const taskData = {
    user_id: user.id,
    title,
    description: description || "",
    priority: validPriorities.includes(priority) ? priority : "medium",
    status: validStatuses.includes(status) ? status : "todo",
    subject,
    deadline,
    is_group: is_group || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await insertTask(taskData);
}

export async function updateTaskForUser(token: string, id: number, payload: any) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  const existingTask = await findTaskById(id);
  if (!existingTask) {
    throw new Error("Task not found or forbidden");
  }

  // Check if owner by user_id first (fallback for legacy tasks)
  const isCreator = existingTask.user_id === user.id;

  // Check membership — both owner and member can edit
  const membership = await findTaskMember(id, user.id);
  if (!isCreator && !membership) {
    throw new Error("Task not found or forbidden");
  }

  const { title, description, priority, status, subject, deadline } = payload;

  const updatedData: any = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updatedData.title = title;
  if (description !== undefined) updatedData.description = description;
  if (subject !== undefined) updatedData.subject = subject;
  if (deadline !== undefined) updatedData.deadline = deadline;

  const validPriorities = ["high", "medium", "low"];
  const validStatuses = ["todo", "inprogress", "done"];

  if (priority !== undefined && validPriorities.includes(priority)) {
    updatedData.priority = priority;
  }
  if (status !== undefined && validStatuses.includes(status)) {
    updatedData.status = status;
  }

  // Update task terlebih dahulu
  const updatedTask = await updateTask(id, user.id, updatedData);

  // Jika status berubah menjadi "done" dan sebelumnya bukan "done"
  // Proses gamification (poin & streak)
  let gamificationResult = null;
  if (status === "done" && existingTask.status !== "done") {
    try {
      gamificationResult = await processTaskCompletion(
        user.id, 
        updatedTask.deadline
      );
    } catch (err) {
      console.error("Error processing gamification:", err);
    }
  }

  return {
    task: updatedTask,
    gamification: gamificationResult
  };
}

export async function deleteTaskForUser(token: string, id: number) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  const task = await findTaskById(id);
  if (!task) {
    throw new Error("Task not found or forbidden");
  }

  // Check if owner by user_id first (fallback for legacy tasks)
  const isCreator = task.user_id === user.id;

  // Check membership
  const membership = await findTaskMember(id, user.id);
  
  if (!isCreator) {
    if (!membership) {
      throw new Error("Task not found or forbidden");
    }
    if (membership.role !== "owner") {
      throw new Error("Hanya pemilik tugas yang bisa menghapus tugas ini");
    }
  }

  return await deleteTaskById(id);
}
