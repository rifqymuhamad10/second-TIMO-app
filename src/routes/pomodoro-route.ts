import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getPomodoroHistory,
  savePomodoroSession,
  getPomodoroStats,
} from "@/services/pomodoro-service";

async function getTokenFromRequest(request: Request): Promise<string> {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }

  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

export async function getPomodoroHandler(request: Request) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const history = await getPomodoroHistory(token);
    const stats = await getPomodoroStats(token);

    return NextResponse.json(
      {
        data: {
          history,
          stats,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function createPomodoroSessionHandler(request: Request) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const session = await savePomodoroSession(token, body);

    return NextResponse.json({ data: session }, { status: 201 });
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    if (error.message === "Missing required fields" || error.message.startsWith("Invalid")) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
