import { supabase } from "@/lib/supabaseClient";
import { isMockEnabled, mockDb } from "@/lib/mockDb";

export async function findUserByEmail(email: string) {
  if (isMockEnabled) {
    return mockDb.findUserByEmail(email);
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function insertUser(userData: any) {
  if (isMockEnabled) {
    return mockDb.insertUser(userData);
  }

  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findUserById(id: number) {
  if (isMockEnabled) {
    return mockDb.findUserById(id);
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateUserStats(id: number, updates: { 
  total_points?: number; 
  current_streak?: number; 
  longest_streak?: number; 
  last_completion_date?: string; 
  streak_freeze?: number;
}) {
  if (isMockEnabled) {
    return mockDb.updateUserById(id, updates);
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateUserById(id: number, userData: any) {
  if (isMockEnabled) {
    return mockDb.updateUserById(id, userData);
  }

  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
