import { getCurrentUser } from "./users-service";
import { findTaskMembersByTaskId, findTaskMember, insertTaskMember, deleteTaskMember } from "@/models/task-members-model";
import { findTaskById } from "@/models/tasks-model";
import { findUserByEmail } from "@/models/users-model";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend, EMAIL_FROM, BASE_URL } from "@/lib/resend";
import { buildCollabInviteEmail, buildNewUserInviteEmail } from "@/lib/email-templates";
import crypto from "crypto";

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

  // Cek apakah email sudah diverifikasi (fitur kolaborasi butuh verifikasi)
  if (!user.email_verified) {
    throw new Error("Verifikasi email kamu terlebih dahulu untuk menggunakan fitur kolaborasi");
  }

  // Verify requester is the owner of this task
  const membership = await findTaskMember(taskId, user.id);
  if (!membership) {
    throw new Error("Task not found or forbidden");
  }
  if (membership.role !== "owner") {
    throw new Error("Hanya pemilik tugas yang bisa mengundang anggota");
  }

  // Ambil data task untuk email
  const task = await findTaskById(taskId);
  if (!task) {
    throw new Error("Task not found or forbidden");
  }

  // Find the user by email
  const targetUser = await findUserByEmail(email);

  if (!targetUser) {
    // ─── Skenario B: User belum terdaftar ─────────────────────────────────
    // Buat invite token dan kirim email undangan + link daftar

    const inviteToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    const { error: insertError } = await supabaseAdmin
      .from("task_invite_tokens")
      .insert([{
        token: inviteToken,
        task_id: taskId,
        invited_email: email,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
      }]);

    if (insertError) {
      console.error("[addTaskMember] Gagal menyimpan invite token:", insertError);
    }

    // Kirim email undangan ke user baru (non-blocking)
    try {
      const registerUrl = `${BASE_URL}/register?invite=${inviteToken}`;
      const { subject, html } = buildNewUserInviteEmail({
        inviterName: user.username,
        taskTitle: task.title,
        registerUrl,
      });

      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject,
        html,
      });
    } catch (emailError) {
      console.error("[addTaskMember] Gagal mengirim email undangan:", emailError);
    }

    throw new Error("EMAIL_NOT_REGISTERED");
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
  if (task && !task.is_group) {
    await supabaseAdmin.from("tasks").update({ is_group: true }).eq("id", taskId);
  }

  // Add the member
  const newMember = await insertTaskMember(taskId, targetUser.id, "member");

  // ─── Skenario A: Kirim notifikasi email ke user yang sudah terdaftar ──
  try {
    const deadlineText = task.deadline
      ? new Date(task.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : undefined;

    const { subject, html } = buildCollabInviteEmail({
      invitedUsername: targetUser.username,
      inviterName: user.username,
      taskTitle: task.title,
      taskDeadline: deadlineText,
      dashboardUrl: `${BASE_URL}/dashboard`,
    });

    await resend.emails.send({
      from: EMAIL_FROM,
      to: targetUser.email,
      subject,
      html,
    });
  } catch (emailError) {
    console.error("[addTaskMember] Gagal mengirim notifikasi email:", emailError);
  }

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
    await supabaseAdmin.from("tasks").update({ is_group: false }).eq("id", taskId);
  }

  return removed;
}

// ─── Consume Invite Token setelah user baru register & verify email ──────────

export async function consumeInviteToken(token: string, userId: number) {
  const { data: invite, error } = await supabaseAdmin
    .from("task_invite_tokens")
    .select("*")
    .eq("token", token)
    .is("used_at", null)
    .maybeSingle();

  if (error || !invite) return null;

  // Cek expiry
  if (new Date(invite.expires_at) < new Date()) return null;

  // Mark as used
  await supabaseAdmin
    .from("task_invite_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invite.id);

  // Check if already a member
  const existingMember = await findTaskMember(invite.task_id, userId);
  if (existingMember) return existingMember;

  // Add to task
  const task = await findTaskById(invite.task_id);
  if (task && !task.is_group) {
    await supabaseAdmin.from("tasks").update({ is_group: true }).eq("id", invite.task_id);
  }

  const member = await insertTaskMember(invite.task_id, userId, "member");
  return member;
}
