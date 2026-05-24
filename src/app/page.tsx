"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Panggil auth.getSession untuk memeriksa koneksi ke API Supabase
        const { error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSupabaseStatus("connected");
      } catch (err: any) {
        console.error("Supabase connection error:", err);
        setErrorMessage(err.message || "Gagal menghubungi API Supabase.");
        setSupabaseStatus("error");
      }
    }
    checkConnection();
  }, []);

  return (
    <div className="hero bg-base-100 py-12 flex-grow items-center justify-center">
      <div className="hero-content text-center flex flex-col max-w-4xl px-4">
        {/* Header Hero */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-content">
            Inisialisasi Project Berhasil!
          </h1>
          <p className="text-lg opacity-75 mb-8">
            Project **TIMO Web V2** telah berhasil diatur menggunakan Next.js, Bun, TailwindCSS, DaisyUI, dan Supabase.
          </p>
        </div>

        {/* Status Hubungan / Integrasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
          {/* Card Tech Stack */}
          <div className="card bg-base-200 shadow-md text-left">
            <div className="card-body">
              <h2 className="card-title text-primary font-bold">Stack & Versi</h2>
              <div className="divider my-1"></div>
              <ul className="space-y-2 text-sm">
                <li>🚀 <strong>Framework:</strong> Next.js 16 (App Router)</li>
                <li>📦 <strong>Package Manager:</strong> Bun</li>
                <li>🎨 <strong>Styling:</strong> TailwindCSS 4</li>
                <li>💅 <strong>UI Components:</strong> DaisyUI 5</li>
                <li>🔌 <strong>Database:</strong> Supabase JS & Realtime</li>
              </ul>
            </div>
          </div>

          {/* Card Supabase Connection */}
          <div className="card bg-base-200 shadow-md text-left">
            <div className="card-body flex flex-col justify-between">
              <div>
                <h2 className="card-title text-secondary font-bold">Koneksi Supabase</h2>
                <div className="divider my-1"></div>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">URL:</span>
                    <code className="text-xs bg-base-300 p-1 rounded break-all text-neutral-content">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL || "Belum Dikonfigurasi"}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Status:</span>
                    {supabaseStatus === "checking" && (
                      <span className="badge badge-warning gap-1">
                        <span className="loading loading-spinner loading-xs"></span> Memeriksa...
                      </span>
                    )}
                    {supabaseStatus === "connected" && (
                      <span className="badge badge-success gap-1 text-success-content font-medium">✓ Terhubung</span>
                    )}
                    {supabaseStatus === "error" && (
                      <span className="badge badge-error gap-1 text-error-content font-medium">✗ Error</span>
                    )}
                  </div>
                </div>
              </div>

              {supabaseStatus === "error" && errorMessage && (
                <div className="alert alert-error text-xs p-2 mt-4 rounded-md text-error-content">
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo DaisyUI Elements */}
        <div className="w-full bg-base-200 p-6 rounded-2xl shadow-md mt-8 text-left">
          <h3 className="text-lg font-bold mb-4 text-center">Uji Coba Komponen DaisyUI</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-accent text-white">Accent Button</button>
            <button className="btn btn-info">Info</button>
            <button className="btn btn-success text-white">Success</button>
            <button className="btn btn-warning">Warning</button>
            <button className="btn btn-error text-white">Error</button>
          </div>
        </div>
      </div>
    </div>
  );
}
