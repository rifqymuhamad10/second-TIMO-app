import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findSessionByToken, } from "@/models/sessions-model";
import { findUserById, updateUserById } from "@/models/users-model";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    // 1. Autentikasi
    let token = "";
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    }

    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const session = await findSessionByToken(token);
    if (!session) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const user = await findUserById(session.user_id);
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    // 2. Parse form data (file upload)
    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ message: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // 3. Validasi tipe & ukuran file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "Ukuran file melebihi batas 5 MB." },
        { status: 400 }
      );
    }

    // 4. Upload ke Supabase Storage
    const ext = file.type.split("/")[1] || "jpg";
    const filePath = `${user.id}/avatar.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true, // timpa file lama jika ada
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { message: "Gagal mengunggah foto. Coba lagi." },
        { status: 500 }
      );
    }

    // 5. Dapatkan public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Tambahkan cache-busting supaya browser muat ulang gambar
    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    // 6. Update avatar_url di database
    await updateUserById(user.id, {
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ data: { avatar_url: avatarUrl } }, { status: 200 });
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
