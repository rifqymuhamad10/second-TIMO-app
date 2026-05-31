"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-nb-bg text-nb-ink">
      {/* Sisi Kiri: Informasi Welcome (Hanya Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-nb-yellow border-nb-r bg-dot-grid flex-col justify-between p-12 select-none">
        <div className="flex items-center gap-2">
          <div className="bg-nb-surface text-nb-ink border-nb-2 px-3 py-1 font-mono font-black text-xl shadow-[3px_3px_0px_#1A1A1A]">
            TI
          </div>
          <span className="font-display font-extrabold text-2xl tracking-wider text-nb-ink uppercase">
            TIMO
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="font-display font-black text-5xl uppercase tracking-wider text-nb-ink leading-[1.1] mb-6">
            Selamat Datang di TIMO.
          </h1>
          <p className="font-body text-lg text-nb-ink/80 leading-relaxed">
            Atur tugas kuliah kamu dalam satu tempat yang rapi, terstruktur, dan
            bebas dari lupa.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t-3 border-nb-ink/10 pt-8">
          <div className="flex items-center gap-3 font-display font-bold uppercase text-xs tracking-wider text-nb-ink/70">
            <span className="w-5 h-5 border-nb-2 bg-nb-surface flex items-center justify-center text-xs">✓</span>
            Gratis untuk Mahasiswa
          </div>
          <div className="flex items-center gap-3 font-display font-bold uppercase text-xs tracking-wider text-nb-ink/70">
            <span className="w-5 h-5 border-nb-2 bg-nb-surface flex items-center justify-center text-xs">✓</span>
            Data Tersimpan di Cloud
          </div>
          <div className="flex items-center gap-3 font-display font-bold uppercase text-xs tracking-wider text-nb-ink/70">
            <span className="w-5 h-5 border-nb-2 bg-nb-surface flex items-center justify-center text-xs">✓</span>
            Akses dari mana saja
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Form Login */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative bg-dot-grid lg:bg-none">
        {/* Logo Mobile */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="bg-nb-yellow text-nb-ink border-nb-2 px-2.5 py-0.5 font-mono font-black text-base shadow-[2px_2px_0px_#1A1A1A]">
            TI
          </div>
          <span className="font-display font-extrabold text-lg tracking-wider text-nb-ink uppercase">
            TIMO
          </span>
        </div>

        <div className="w-full max-w-md bg-nb-surface border-nb shadow-nb-lg p-6 md:p-8">
          <h2 className="font-display font-black text-2xl uppercase tracking-wider text-nb-ink mb-6 border-b-3 border-nb-ink pb-3 text-center lg:text-left">
            Masuk ke Akunmu
          </h2>

          {error && (
            <div className="bg-nb-red/10 border-nb-2 border-nb-red p-4 mb-6 font-body font-bold text-xs uppercase text-nb-red">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              id="login-email"
              label="Email *"
              type="email"
              placeholder="nama@mahasiswa.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <Input
              id="login-password"
              label="Password *"
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <Button variant="primary" type="submit" fullWidth disabled={loading}>
              {loading ? "Menghubungkan..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-8 border-t-3 border-nb-ink/10 pt-4 text-center">
            <p className="font-body text-xs font-bold uppercase tracking-wider text-nb-ink/60">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-nb-blue hover:underline font-extrabold"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
