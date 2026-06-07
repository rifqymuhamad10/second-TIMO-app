import { supabase } from "@/lib/supabaseClient";
import { isMockEnabled, mockDb } from "@/lib/mockDb";
import { findTaskIdsByUserId, insertTaskMember } from "./task-members-model";

export async function findTasksByUserId(userId: number) {
  if (isMockEnabled) {
    return mockDb.findTasksByUserId(userId);
  }

  // Step 1: Get all task IDs the user is a member of
  const taskIds = await findTaskIdsByUserId(userId);

  if (taskIds.length === 0) {
    return [];
  }

  // Step 2: Fetch full task data with members
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      task_members (
        id,
        user_id,
        role,
        joined_at,
        users (
          id,
          username,
          email
        )
      )
    `)
    .in("id", taskIds)
    .order("deadline", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findTaskById(id: number) {
  if (isMockEnabled) {
    return mockDb.findTaskById(id);
  }

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      task_members (
        id,
        user_id,
        role,
        joined_at,
        users (
          id,
          username,
          email
        )
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Keep backward-compatible function
export async function findTaskByIdAndUserId(id: number, userId: number) {
  if (isMockEnabled) {
    return mockDb.findTaskByIdAndUserId(id, userId);
  }
  return await findTaskById(id);
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

  // Automatically register the creator as the task owner in task_members
  if (data && taskData.user_id) {
    await insertTaskMember(data.id, taskData.user_id, "owner");
  }

  return data;
}

export async function updateTaskById(id: number, taskData: any) {
  if (isMockEnabled) {
    return mockDb.updateTaskById(id, taskData);
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(taskData)
    .eq("id", id)
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
  // Now update by task ID only (authorization is checked in the service layer)
  return await updateTaskById(id, taskData);
}

export async function deleteTaskById(id: number) {
  if (isMockEnabled) {
    return mockDb.deleteTaskById(id);
  }

  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteTask(id: number, userId: number) {
  if (isMockEnabled) {
    return mockDb.deleteTask(id, userId);
  }
  // Now delete by task ID only (authorization is checked in the service layer)
  return await deleteTaskById(id);
}
