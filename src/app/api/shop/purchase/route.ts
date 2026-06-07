import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { purchaseStreakFreeze } from "@/services/shop-service";

async function getTokenFromRequest(request: Request): Promise<string> {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }

  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

export async function POST(request: Request) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId } = body;

    if (itemId !== "streak_freeze") {
      return NextResponse.json({ message: "Item tidak valid" }, { status: 400 });
    }

    const updatedUser = await purchaseStreakFreeze(token, 200);
    return NextResponse.json({ data: updatedUser, message: "Pembelian berhasil" }, { status: 200 });
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    if (error.message === "Poin tidak cukup untuk membeli item ini") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
