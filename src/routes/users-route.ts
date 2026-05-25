import { NextResponse } from "next/server";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "@/services/users-service";

export async function registerHandler(request: Request) {
  try {
    const body = await request.json();
    await registerUser(body);

    return NextResponse.json(
      { data: "OK" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "email sudah terdaftar ") {
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

export async function loginHandler(request: Request) {
  try {
    const body = await request.json();
    const token = await loginUser(body);

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
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    // Ambil token setelah tulisan "bearer "
    const token = authHeader.substring(7).trim();
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

export async function logoutHandler(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    // Ambil token setelah tulisan "bearer "
    const token = authHeader.substring(7).trim();
    const user = await logoutUser(token);

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

