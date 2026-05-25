import bcrypt from "bcrypt";
import { findUserByEmail, insertUser } from "@/models/users-model";

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
