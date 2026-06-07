import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/services/users-service";
import { BASE_URL } from "@/lib/resend";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    // Redirect ke halaman error
    return NextResponse.redirect(`${BASE_URL}/login?verified=false&reason=missing_token`);
  }

  try {
    await verifyEmail(token);
    // Sukses → redirect ke login dengan notif sukses
    return NextResponse.redirect(`${BASE_URL}/login?verified=true`);
  } catch (error: any) {
    const reason = encodeURIComponent(error.message || "Token tidak valid");
    return NextResponse.redirect(`${BASE_URL}/login?verified=false&reason=${reason}`);
  }
}
