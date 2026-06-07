import { supabase } from "@/lib/supabaseClient";

export async function findTaskMembersByTaskId(taskId: number) {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from("task_members")
    .select("task_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data?.map((row: any) => row.task_id) || [];
}
