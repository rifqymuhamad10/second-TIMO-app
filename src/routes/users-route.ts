import { NextResponse } from "next/server";
import { registerUser, loginUser, getCurrentUser, logoutUser, updateUserProfile } from "@/services/users-service";

export async function registerHandler(request: Request) {
  try {
    const body = await request.json();
    await registerUser(body);

    return NextResponse.json(
      { data: "OK" },
      { status: 200 }
    );
  } catch (error: any) {
    if (
      error.message === "email sudah terdaftar " ||
      error.message === "username tidak boleh lebih dari 255 karakter"
    ) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

import { cookies } from "next/headers";

export async function loginHandler(request: Request) {
  try {
    const body = await request.json();
    const token = await loginUser(body);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json(
      { data: token },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "email atau password salah" || error.message === "Missing required fields") {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function getCurrentUserHandler(request: Request) {
  try {
    let token = "";
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    }

    if (!token) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    const user = await getCurrentUser(token);

    return NextResponse.json(
      { data: user },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function updateCurrentUserHandler(request: Request) {
  try {
    let token = "";
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    }

    if (!token) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const user = await updateUserProfile(token, body);

    return NextResponse.json(
      { data: user },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }
    if (error.message === "username tidak boleh lebih dari 255 karakter" || error.message.startsWith("Password minimal")) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function logoutHandler(request: Request) {
  try {
    let token = "";
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    }

    if (!token) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    const user = await logoutUser(token);

    // Hapus cookie
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return NextResponse.json(
      { data: user },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "unauthorized") {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

