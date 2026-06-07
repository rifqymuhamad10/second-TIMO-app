import { getCurrentUser } from "./users-service";
import { findTaskMembersByTaskId, findTaskMember, insertTaskMember, deleteTaskMember } from "@/models/task-members-model";
import { findTaskById } from "@/models/tasks-model";
import { findUserByEmail } from "@/models/users-model";

export async function getTaskMembers(token: string, taskId: number) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  // Verify requester is a member of this task
  const membership = await findTaskMember(taskId, user.id);
  if (!membership) {
    throw new Error("Task not found or forbidden");
  }

  const members = await findTaskMembersByTaskId(taskId);
  return members;
}

export async function addTaskMember(token: string, taskId: number, email: string) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  // Verify requester is the owner of this task
  const membership = await findTaskMember(taskId, user.id);
  if (!membership) {
    throw new Error("Task not found or forbidden");
  }
  if (membership.role !== "owner") {
    throw new Error("Hanya pemilik tugas yang bisa mengundang anggota");
  }

  // Find the user by email
  const targetUser = await findUserByEmail(email);
  if (!targetUser) {
    throw new Error("Email tidak terdaftar di sistem");
  }

  // Cannot add yourself
  if (targetUser.id === user.id) {
    throw new Error("Anda sudah menjadi pemilik tugas ini");
  }

  // Check if already a member
  const existingMember = await findTaskMember(taskId, targetUser.id);
  if (existingMember) {
    throw new Error("Pengguna sudah menjadi anggota tugas ini");
  }

  // Mark task as group if not already
  const task = await findTaskById(taskId);
  if (task && !task.is_group) {
    const { supabase } = await import("@/lib/supabaseClient");
    await supabase.from("tasks").update({ is_group: true }).eq("id", taskId);
  }

  // Add the member
  const newMember = await insertTaskMember(taskId, targetUser.id, "member");
  return newMember;
}

export async function removeTaskMember(token: string, taskId: number, targetUserId: number) {
  const user = await getCurrentUser(token);
  if (!user) {
    throw new Error("unauthorized");
  }

  // Verify requester is a member of this task
  const membership = await findTaskMember(taskId, user.id);
  if (!membership) {
    throw new Error("Task not found or forbidden");
  }

  // If the requester is kicking someone else, they must be the owner
  if (targetUserId !== user.id && membership.role !== "owner") {
    throw new Error("Hanya pemilik tugas yang bisa mengeluarkan anggota");
  }

  // Owner cannot leave their own task (they should delete it instead)
  if (targetUserId === user.id && membership.role === "owner") {
    throw new Error("Pemilik tidak bisa keluar dari tugas sendiri. Hapus tugas jika tidak diperlukan.");
  }

  // Cannot kick the owner
  const targetMembership = await findTaskMember(taskId, targetUserId);
  if (!targetMembership) {
    throw new Error("Pengguna bukan anggota tugas ini");
  }
  if (targetMembership.role === "owner") {
    throw new Error("Tidak bisa mengeluarkan pemilik tugas");
  }

  const removed = await deleteTaskMember(taskId, targetUserId);

  // Check remaining members count. If only owner is left, mark as not group
  const remainingMembers = await findTaskMembersByTaskId(taskId);
  if (remainingMembers && remainingMembers.length <= 1) {
    const { supabase } = await import("@/lib/supabaseClient");
    await supabase.from("tasks").update({ is_group: false }).eq("id", taskId);
  }

  return removed;
}
