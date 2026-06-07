import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getTasksForUser,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
} from "@/services/tasks-service";

async function getTokenFromRequest(request: Request): Promise<string> {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }

  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

export async function getTasksHandler(request: Request) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const tasks = await getTasksForUser(token);
    return NextResponse.json({ data: tasks }, { status: 200 });
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

export async function createTaskHandler(request: Request) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const task = await createTaskForUser(token, body);
    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    if (error.message.startsWith("Missing required fields")) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function updateTaskHandler(request: Request, id: number) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const task = await updateTaskForUser(token, id, body);
    return NextResponse.json({ data: task }, { status: 200 });
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    if (error.message === "Task not found or forbidden") {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function deleteTaskHandler(request: Request, id: number) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const task = await deleteTaskForUser(token, id);
    return NextResponse.json({ data: task }, { status: 200 });
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    if (
      error.message === "Task not found or forbidden" || 
      error.message.includes("Hanya pemilik tugas")
    ) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
