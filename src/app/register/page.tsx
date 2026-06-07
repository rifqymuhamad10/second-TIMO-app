"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AlertTriangle } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [institution, setInstitution] = useState("");
  const [major, setMajor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirmPassword || !role || !institution || !major) {
      setError("Semua field wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password, role, institution, major);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Pastikan email belum terdaftar.");
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
            Gabung Sekarang Juga.
          </h1>
          <p className="font-body text-lg text-nb-ink/80 leading-relaxed">
            Buat akun TIMO kamu hari ini dan rasakan kemudahan mengorganisasikan tugas-tugas perkuliahan secara sistematis.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t-3 border-nb-ink/10 pt-8">
          <div className="flex items-center gap-3 font-display font-bold uppercase text-xs tracking-wider text-nb-ink/70">
            <span className="w-5 h-5 border-nb-2 bg-nb-surface flex items-center justify-center text-xs">✓</span>
            Proses Pendaftaran Cepat
          </div>
          <div className="flex items-center gap-3 font-display font-bold uppercase text-xs tracking-wider text-nb-ink/70">
            <span className="w-5 h-5 border-nb-2 bg-nb-surface flex items-center justify-center text-xs">✓</span>
            Desain Simpel & Memorable
          </div>
          <div className="flex items-center gap-3 font-display font-bold uppercase text-xs tracking-wider text-nb-ink/70">
            <span className="w-5 h-5 border-nb-2 bg-nb-surface flex items-center justify-center text-xs">✓</span>
            Kolaborasi Tim Mahasiswa
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Form Register */}
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
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-nb-green border-nb shadow-nb flex items-center justify-center mx-auto mb-6 text-3xl font-black">
                ✓
              </div>
              <h3 className="font-display font-extrabold text-xl uppercase tracking-wider mb-2">
                Pendaftaran Berhasil!
              </h3>
              <p className="font-body text-sm text-nb-ink/70 mb-8 leading-relaxed">
                Akun Anda telah berhasil dibuat. Silakan klik tombol di bawah untuk masuk ke aplikasi.
              </p>
              <Button
                variant="primary"
                onClick={() => router.push("/login")}
                fullWidth
              >
                Masuk Sekarang
              </Button>
            </div>
          ) : (
            <>
              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-nb-ink mb-6 border-b-3 border-nb-ink pb-3 text-center lg:text-left">
                Daftar Akun Baru
              </h2>

              {error && (
                <div className="bg-nb-red/10 border-nb-2 border-nb-red p-4 mb-6 font-body font-bold text-xs uppercase text-nb-red animate-shake flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  id="register-username"
                  label="Nama Lengkap *"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />

                <Input
                  id="register-email"
                  label="Email *"
                  type="email"
                  placeholder="Alamat Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="register-role"
                    className="font-body font-bold text-sm tracking-wide text-nb-ink uppercase"
                  >
                    Status / Peran *
                  </label>
                  <select
                    id="register-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="w-full bg-nb-surface text-nb-ink border-nb px-4 h-12 text-base font-body focus:outline-none focus:border-nb-blue transition-colors cursor-pointer"
                    required
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="pelajar">Pelajar</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>

                <Input
                  id="register-institution"
                  label="Sekolah / Kampus *"
                  type="text"
                  placeholder="Sekolah / Kampus"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  disabled={loading}
                  required
                />

                <Input
                  id="register-major"
                  label="Jurusan / Kelas *"
                  type="text"
                  placeholder="Jurusan / Kelas"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  disabled={loading}
                  required
                />

                <Input
                  id="register-password"
                  label="Password *"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                <Input
                  id="register-confirm-password"
                  label="Konfirmasi Password *"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                <Button variant="primary" type="submit" fullWidth disabled={loading}>
                  {loading ? "Mendaftarkan..." : "Daftar Akun"}
                </Button>
              </form>

              <div className="mt-8 border-t-3 border-nb-ink/10 pt-4 text-center">
                <p className="font-body text-xs font-bold uppercase tracking-wider text-nb-ink/60">
                  Sudah memiliki akun?{" "}
                  <Link
                    href="/login"
                    className="text-nb-blue hover:underline font-extrabold"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
