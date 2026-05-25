import { supabase } from "@/lib/supabaseClient";

export async function insertSession(sessionData: { token: string; user_id: number }) {
  const { data, error } = await supabase
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
