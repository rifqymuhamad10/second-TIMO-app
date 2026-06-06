import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/pomodoro");

  if (!token && isProtectedRoute) {
    // Pengguna belum login mencoba masuk halaman terproteksi -> alihkan ke login
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (token && isAuthRoute) {
    // Pengguna sudah login mencoba masuk halaman login/register -> alihkan ke dashboard
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Konfigurasi path mana saja yang akan difilter oleh middleware
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/pomodoro/:path*", "/login", "/register"],
};
