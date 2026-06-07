import { findUserById, updateUserStats } from "@/models/users-model";

/**
 * Menghitung poin berdasarkan seberapa cepat tugas diselesaikan
 * Formula: Semakin cepat selesai = semakin banyak poin
 * - 3+ hari sebelum deadline: 100 poin
 * - 2 hari sebelum deadline: 75 poin
 * - 1 hari sebelum deadline: 50 poin
 * - Hari H deadline: 25 poin
 * - Terlambat: 10 poin (tetap dapat poin untuk usaha)
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
 * Streak = hari berturut-turut menyelesaikan tugas
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

/**
 * Periksa dan pelihara streak harian pengguna (termasuk fitur streak freeze)
 * Fungsi ini dipanggil secara transparan saat pengguna login atau memuat sesi.
 */
export async function checkAndResetStreak(user: any): Promise<any> {
  if (user.current_streak > 0 && user.last_completion_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = new Date(user.last_completion_date);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // Streak hangus karena tidak menyelesaikan tugas kemarin
      if ((user.streak_freeze || 0) > 0) {
        // Konsumsi streak freeze
        const newStreakFreeze = user.streak_freeze - 1;

        // Set last_completion_date ke kemarin agar streak terselamatkan
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const updatedUser = await updateUserStats(user.id, {
          streak_freeze: newStreakFreeze,
          last_completion_date: yesterday.toISOString(),
        });
        
        // Gabungkan kembali data user
        return { ...user, ...updatedUser };
      } else {
        // Reset streak menjadi 0
        const updatedUser = await updateUserStats(user.id, {
          current_streak: 0,
        });
        
        return { ...user, ...updatedUser };
      }
    }
  }
  return user;
}

