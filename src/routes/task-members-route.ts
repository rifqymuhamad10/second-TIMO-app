import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getTaskMembers,
  addTaskMember,
  removeTaskMember,
} from "@/services/task-members-service";

async function getTokenFromRequest(request: Request): Promise<string> {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }

  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || "";
}

export async function getMembersHandler(request: Request, taskId: number) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const members = await getTaskMembers(token, taskId);
    return NextResponse.json({ data: members }, { status: 200 });
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

export async function addMemberHandler(request: Request, taskId: number) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
    }

    const member = await addTaskMember(token, taskId, email);
    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    if (
      error.message === "Task not found or forbidden" ||
      error.message === "Hanya pemilik tugas yang bisa mengundang anggota"
    ) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    if (
      error.message === "Email tidak terdaftar di sistem" ||
      error.message === "Pengguna sudah menjadi anggota tugas ini" ||
      error.message === "Anda sudah menjadi pemilik tugas ini"
    ) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error.message === "EMAIL_NOT_REGISTERED") {
      return NextResponse.json({
        message: "Email belum terdaftar di TIMO. Kami sudah mengirimkan undangan agar mereka bisa daftar dan langsung join tugas ini.",
        code: "EMAIL_NOT_REGISTERED"
      }, { status: 200 }); // 200 karena ini bukan error — undangan terkirim
    }
    if (error.message.includes("Verifikasi email")) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function removeMemberHandler(request: Request, taskId: number, targetUserId: number) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const result = await removeTaskMember(token, taskId, targetUserId);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    if (
      error.message === "Task not found or forbidden" ||
      error.message === "Hanya pemilik tugas yang bisa mengeluarkan anggota" ||
      error.message === "Tidak bisa mengeluarkan pemilik tugas"
    ) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    if (
      error.message === "Pengguna bukan anggota tugas ini" ||
      error.message.includes("Pemilik tidak bisa keluar")
    ) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
