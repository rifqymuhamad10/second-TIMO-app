import { supabase } from "@/lib/supabaseClient";
import { isMockEnabled, mockDb } from "@/lib/mockDb";

export async function findTasksByUserId(userId: number) {
  if (isMockEnabled) {
    return mockDb.findTasksByUserId(userId);
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("deadline", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findTaskByIdAndUserId(id: number, userId: number) {
  if (isMockEnabled) {
    return mockDb.findTaskByIdAndUserId(id, userId);
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function insertTask(taskData: any) {
  if (isMockEnabled) {
    return mockDb.insertTask(taskData);
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert([taskData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateTask(id: number, userId: number, taskData: any) {
  if (isMockEnabled) {
    return mockDb.updateTask(id, userId, taskData);
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(taskData)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteTask(id: number, userId: number) {
  if (isMockEnabled) {
    return mockDb.deleteTask(id, userId);
  }

  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

