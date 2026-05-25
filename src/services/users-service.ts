import bcrypt from "bcrypt";
import crypto from "crypto";
import { findUserByEmail, insertUser, findUserById } from "@/models/users-model";
import { insertSession, findSessionByToken, deleteSessionByToken } from "@/models/sessions-model";

export async function registerUser(payload: any) {
  const { username, password, email } = payload;

  if (!username || !password || !email) {
    throw new Error("Missing required fields");
  }

  // Cek apakah email sudah terdaftar
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("email sudah terdaftar ");
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Buat data user baru
  const newUserData = {
    username,
    email,
    password: hashedPassword,
    role: "user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Simpan ke database
  const user = await insertUser(newUserData);
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
  const user = await findUserById(session.user_id);
  if (!user) {
    throw new Error("unauthorized");
  }

  // 3. Keamanan: Hapus password hash dari response
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
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

