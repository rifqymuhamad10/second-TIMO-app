import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isMockEnabled, mockDb } from "@/lib/mockDb";

export async function insertSession(sessionData: { token: string; user_id: number }) {
  if (isMockEnabled) {
    return mockDb.insertSession(sessionData);
  }

  const { data, error } = await supabaseAdmin
    .from("sessions")
    .insert([
      {
        token: sessionData.token,
        user_id: sessionData.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findSessionByToken(token: string) {
  if (isMockEnabled) {
    return mockDb.findSessionByToken(token);
  }

  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteSessionByToken(token: string) {
  if (isMockEnabled) {
    return mockDb.deleteSessionByToken(token);
  }

  const { data, error } = await supabaseAdmin
    .from("sessions")
    .delete()
    .eq("token", token)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


