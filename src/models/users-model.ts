import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isMockEnabled, mockDb } from "@/lib/mockDb";

export async function findUserByEmail(email: string) {
  if (isMockEnabled) {
    return mockDb.findUserByEmail(email);
  }

  const { data, error } = await supabaseAdmin
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

  const { data, error } = await supabaseAdmin
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

  const { data, error } = await supabaseAdmin
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

  const { data, error } = await supabaseAdmin
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

  const { data, error } = await supabaseAdmin
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

// ─── Email Verification ───────────────────────────────────────────────────────

export async function findUserByVerificationToken(token: string) {
  if (isMockEnabled) return null;

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email_verification_token", token)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function markEmailVerified(userId: number) {
  if (isMockEnabled) return null;

  const { data, error } = await supabaseAdmin
    .from("users")
    .update({
      email_verified: true,
      email_verification_token: null,
      email_verification_expires_at: null,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
