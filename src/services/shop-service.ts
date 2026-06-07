import { getCurrentUser } from "./users-service";
import { updateUserStats } from "@/models/users-model";

/**
 * Membeli item Streak Freeze dari toko
 * @param token Token autentikasi user
 * @param cost Harga item dalam poin (default: 200)
 */
export async function purchaseStreakFreeze(token: string, cost: number = 200) {
  const user = await getCurrentUser(token);
  
  if (!user) {
    throw new Error("unauthorized");
  }

  const currentPoints = user.total_points || 0;
  
  if (currentPoints < cost) {
    throw new Error("Poin tidak cukup untuk membeli item ini");
  }

  // Kurangi poin dan tambahkan item streak freeze
  const updatedUser = await updateUserStats(user.id, {
    total_points: currentPoints - cost,
    streak_freeze: (user.streak_freeze || 0) + 1,
  });

  // Amankan data password sebelum dikembalikan
  const { password, ...userWithoutPassword } = { ...user, ...updatedUser };
  
  return userWithoutPassword;
}
