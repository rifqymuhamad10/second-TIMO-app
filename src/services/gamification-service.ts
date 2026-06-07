import { findUserById, updateUserStats } from "@/models/users-model";

/**
 * Menghitung poin berdasarkan seberapa cepat tugas diselesaikan
 * Formula: Semakin cepat selesai = semakin banyak poin
 */
export function calculatePoints(completedAt: Date, deadline: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysBeforeDeadline = (deadline.getTime() - completedAt.getTime()) / msPerDay;

  if (daysBeforeDeadline >= 3) {
    return 100;
  } else if (daysBeforeDeadline >= 2) {
    return 75;
  } else if (daysBeforeDeadline >= 1) {
    return 50;
  } else if (daysBeforeDeadline >= 0) {
    return 25;
  } else {
    return 10; // Tetap dapat poin meskipun terlambat
  }
}

/**
 * Update streak user setelah menyelesaikan tugas
 */
export async function updateStreak(userId: number): Promise<{ 
  currentStreak: number; 
  longestStreak: number; 
  isNewRecord: boolean;
}> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = user.current_streak || 0;
  let longestStreak = user.longest_streak || 0;
  let lastCompletionDate = user.last_completion_date 
    ? new Date(user.last_completion_date) 
    : null;

  if (lastCompletionDate) {
    lastCompletionDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Sudah menyelesaikan tugas hari ini, streak tidak bertambah
      return {
        currentStreak,
        longestStreak,
        isNewRecord: false
      };
    } else if (daysDiff === 1) {
      // Hari berturut-turut, tambah streak
      currentStreak += 1;
    } else {
      // Putus streak, mulai dari 1
      currentStreak = 1;
    }
  } else {
    // Pertama kali menyelesaikan tugas
    currentStreak = 1;
  }

  // Update longest streak jika current streak lebih besar
  const isNewRecord = currentStreak > longestStreak;
  if (isNewRecord) {
    longestStreak = currentStreak;
  }

  // Update database
  await updateUserStats(userId, {
    current_streak: currentStreak,
    longest_streak: longestStreak,
    last_completion_date: today.toISOString()
  });

  return {
    currentStreak,
    longestStreak,
    isNewRecord
  };
}

/**
 * Tambah poin ke user
 */
export async function addPoints(userId: number, points: number): Promise<number> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const newTotalPoints = (user.total_points || 0) + points;

  await updateUserStats(userId, {
    total_points: newTotalPoints
  });

  return newTotalPoints;
}

/**
 * Process gamification saat tugas selesai
 */
export async function processTaskCompletion(
  userId: number, 
  deadline: string
): Promise<{
  pointsEarned: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
}> {
  const completedAt = new Date();
  const deadlineDate = new Date(deadline);

  // Hitung dan tambah poin
  const pointsEarned = calculatePoints(completedAt, deadlineDate);
  const totalPoints = await addPoints(userId, pointsEarned);

  // Update streak
  const streakData = await updateStreak(userId);

  return {
    pointsEarned,
    totalPoints,
    ...streakData
  };
}
