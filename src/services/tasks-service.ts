import { getCurrentUser } from "./users-service";
import {
  findTasksByUserId,
  findTaskById,
  insertTask,
  updateTaskById,
  deleteTaskById,
} from "@/models/tasks-model";
import { findTaskMember } from "@/models/task-members-model";

export async function getTasksForUser(token: string) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }
  return await findTasksByUserId(user.id);
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

  // Check membership — both owner and member can edit
  const membership = await findTaskMember(id, user.id);
  if (!membership) {
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

  return await updateTaskById(id, updatedData);
}

export async function deleteTaskForUser(token: string, id: number) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  // Only the owner can delete the task
  const membership = await findTaskMember(id, user.id);
  if (!membership) {
    throw new Error("Task not found or forbidden");
  }

  if (membership.role !== "owner") {
    throw new Error("Hanya pemilik tugas yang bisa menghapus tugas ini");
  }

  return await deleteTaskById(id);
}
