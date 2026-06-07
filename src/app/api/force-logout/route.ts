import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Force logout route — hapus cookie token tanpa perlu validasi session.
 * Berguna saat session di DB sudah dihapus tapi cookie masih ada di browser.
 * GET /api/force-logout
 */
export async function GET() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // langsung expire
  });

  return NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
  );
}
