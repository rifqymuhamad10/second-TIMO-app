import { NextResponse } from "next/server";
import { registerUser, loginUser } from "@/services/users-service";

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

