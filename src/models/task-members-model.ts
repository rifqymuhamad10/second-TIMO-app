import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isMockEnabled, mockDb } from "@/lib/mockDb";

export async function findTaskMembersByTaskId(taskId: number) {
  if (isMockEnabled) {
    const task = await mockDb.findTaskById(taskId);
    return task?.task_members || [];
  }

  const { data, error } = await supabaseAdmin
    .from("task_members")
    .select(`
      id,
      task_id,
      user_id,
      role,
      joined_at,
      users (
        id,
        username,
        email
      )
    `)
    .eq("task_id", taskId)
    .order("joined_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findTaskMember(taskId: number, userId: number) {
  if (isMockEnabled) {
    const task = await mockDb.findTaskById(taskId);
    if (task && Number(task.user_id) === Number(userId)) {
      return {
        id: 1,
        task_id: taskId,
        user_id: userId,
        role: "owner",
        joined_at: task.created_at
      };
    }
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("task_members")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function insertTaskMember(taskId: number, userId: number, role: string = "member") {
  if (isMockEnabled) {
    return {
      id: 999,
      task_id: taskId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString()
    };
  }

  const { data, error } = await supabaseAdmin
    .from("task_members")
    .insert([{
      task_id: taskId,
      user_id: userId,
      role,
    }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteTaskMember(taskId: number, userId: number) {
  if (isMockEnabled) {
    return {
      task_id: taskId,
      user_id: userId
    };
  }

  const { data, error } = await supabaseAdmin
    .from("task_members")
    .delete()
    .eq("task_id", taskId)
    .eq("user_id", userId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findTaskIdsByUserId(userId: number) {
  if (isMockEnabled) {
    const tasks = await mockDb.findTasksByUserId(userId);
    return tasks.map((t: any) => t.id);
  }

  const { data, error } = await supabaseAdmin
    .from("task_members")
    .select("task_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data?.map((row: any) => row.task_id) || [];
}
