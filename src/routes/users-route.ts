import { NextResponse } from "next/server";
import { registerUser } from "@/services/users-service";

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
