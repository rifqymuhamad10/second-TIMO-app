import bcrypt from "bcrypt";
import crypto from "crypto";
import { findUserByEmail, insertUser, findUserById, updateUserById, findUserByVerificationToken, markEmailVerified } from "@/models/users-model";
import { insertSession, findSessionByToken, deleteSessionByToken } from "@/models/sessions-model";
import { checkAndResetStreak } from "./gamification-service";
import { resend, EMAIL_FROM, BASE_URL } from "@/lib/resend";
import { buildVerificationEmail } from "@/lib/email-templates";

export async function registerUser(payload: any) {
  const { username, password, email, role, institution, major } = payload;

  if (!username || !password || !email || !role || !institution || !major) {
    throw new Error("Semua field wajib diisi");
  }

  if (username.length > 255) {
    throw new Error("username tidak boleh lebih dari 255 karakter");
  }

  // Cek apakah email sudah terdaftar
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("email sudah terdaftar ");
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const validRoles = ["mahasiswa", "pelajar", "umum"];
  const finalRole = validRoles.includes(role) ? role : "mahasiswa";

  // Generate token verifikasi email
  const verificationToken = crypto.randomUUID();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

  // Buat data user baru
  const newUserData = {
    username,
    email,
    password: hashedPassword,
    role: finalRole,
    institution,
    major,
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
    streak_freeze: 0,
    email_verified: false,
    email_verification_token: verificationToken,
    email_verification_expires_at: verificationExpires.toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Simpan ke database
  const user = await insertUser(newUserData);

  // Kirim email verifikasi (non-blocking — jangan gagalkan registrasi jika email gagal)
  try {
    const verifyUrl = `${BASE_URL}/api/verify-email?token=${verificationToken}`;
    const { subject, html } = buildVerificationEmail({ username, verifyUrl });

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch (emailError) {
    // Log tapi jangan throw — user tetap berhasil terdaftar
    console.error("[registerUser] Gagal mengirim email verifikasi:", emailError);
  }

  return user;
}

export async function loginUser(payload: any) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Missing required fields");
  }

  // 1. Cari user berdasarkan email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("email atau password salah");
  }

  // 2. Bandingkan password menggunakan bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("email atau password salah");
  }

  // 3. Generate token UUID baru
  const token = crypto.randomUUID();

  // 4. Simpan session ke database
  await insertSession({
    token,
    user_id: user.id
  });

  // 5. Kembalikan token untuk response API
  return token;
}

export async function getCurrentUser(token: string) {
  if (!token) {
    throw new Error("unauthorized");
  }

  // 1. Cari session berdasarkan token
  const session = await findSessionByToken(token);
  if (!session) {
    throw new Error("unauthorized");
  }

  // 2. Cari user berdasarkan user_id dari session
  let user = await findUserById(session.user_id);
  if (!user) {
    throw new Error("unauthorized");
  }

  // Cek dan reset streak harian (streak freeze / missed day logic)
  user = await checkAndResetStreak(user);

  // 3. Keamanan: Hapus password hash dari response
  const { password, email_verification_token, email_verification_expires_at, ...userWithoutSensitive } = user;

  return userWithoutSensitive;
}

export async function logoutUser(token: string) {
  if (!token) {
    throw new Error("unauthorized");
  }

  // 1. Cari session berdasarkan token
  const session = await findSessionByToken(token);
  if (!session) {
    throw new Error("unauthorized");
  }

  // 2. Cari user berdasarkan user_id dari session
  const user = await findUserById(session.user_id);
  if (!user) {
    throw new Error("unauthorized");
  }

  // 3. Hapus session dari database
  await deleteSessionByToken(token);

  // 4. Keamanan: Hapus password hash dari response
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function updateUserProfile(token: string, payload: any) {
  if (!token) {
    throw new Error("unauthorized");
  }

  const session = await findSessionByToken(token);
  if (!session) {
    throw new Error("unauthorized");
  }

  const user = await findUserById(session.user_id);
  if (!user) {
    throw new Error("unauthorized");
  }

  const { username, role, major, institution, avatar_url, password } = payload;
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (username !== undefined) {
    if (username.length > 255) {
      throw new Error("username tidak boleh lebih dari 255 karakter");
    }
    updateData.username = username;
  }

  if (role !== undefined) {
    const validRoles = ["mahasiswa", "pelajar", "umum"];
    updateData.role = validRoles.includes(role) ? role : "mahasiswa";
  }

  if (major !== undefined) {
    updateData.major = major;
  }

  if (institution !== undefined) {
    updateData.institution = institution;
  }

  if (avatar_url !== undefined) {
    updateData.avatar_url = avatar_url;
  }

  if (password) {
    if (password.length < 6) {
      throw new Error("Password minimal 6 karakter");
    }
    const saltRounds = 10;
    updateData.password = await bcrypt.hash(password, saltRounds);
  }

  const updatedUser = await updateUserById(user.id, updateData);
  const { password: _, email_verification_token, email_verification_expires_at, ...userWithoutSensitive } = updatedUser;
  return userWithoutSensitive;
}

// ─── Email Verification ───────────────────────────────────────────────────────

export async function verifyEmail(token: string) {
  if (!token) {
    throw new Error("Token tidak valid");
  }

  const user = await findUserByVerificationToken(token);
  if (!user) {
    throw new Error("Token tidak valid atau sudah digunakan");
  }

  // Cek expiry
  if (user.email_verification_expires_at) {
    const expiresAt = new Date(user.email_verification_expires_at);
    if (expiresAt < new Date()) {
      throw new Error("Token sudah kedaluwarsa. Silakan daftar ulang.");
    }
  }

  // Tandai email sebagai terverifikasi
  await markEmailVerified(user.id);

  return user;
}
