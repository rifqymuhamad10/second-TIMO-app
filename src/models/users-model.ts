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

