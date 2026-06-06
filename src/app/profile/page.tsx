"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { Task } from "@/components/tasks/TaskCard";
import { User, Mail, Award, BookOpen, LogOut, ArrowLeft, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import PomodoroStats from "@/components/pomodoro/PomodoroStats";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

export default function ProfilePage() {
  const { user, logout, token, refreshUser } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formUsername, setFormUsername] = useState("");
  const [formRole, setFormRole] = useState("mahasiswa");
  const [formMajor, setFormMajor] = useState("");
  const [formInstitution, setFormInstitution] = useState("");
  const [formAvatarUrl, setFormAvatarUrl] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const getRoleLabel = (role?: string) => {
    if (role === "mahasiswa") return "Mahasiswa";
    if (role === "pelajar") return "Pelajar";
    if (role === "umum") return "Umum";
    return role || "Mahasiswa";
  };

  // Initialize form fields when user data is loaded
  useEffect(() => {
    if (user) {
      setFormUsername(user.username || "");
      setFormRole(user.role || "mahasiswa");
      setFormMajor(user.major || "");
      setFormInstitution(user.institution || "");
      setFormAvatarUrl(user.avatar_url || "");
    }
  }, [user, isEditModalOpen]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setFormSubmitting(true);

    try {
      const activeToken = token || localStorage.getItem("token");
      
      const payload: any = {
        username: formUsername,
        role: formRole,
        major: formMajor,
        institution: formInstitution,
        avatar_url: formAvatarUrl,
      };

      if (formPassword.trim()) {
        if (formPassword.length < 6) {
          throw new Error("Password minimal 6 karakter");
        }
        payload.password = formPassword;
      }

      const res = await fetch("/api/users/current", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Gagal memperbarui profil");
      }

      await refreshUser();
      setFormSuccess("Profil berhasil diperbarui!");
      setFormPassword(""); // reset password input
      setTimeout(() => {
        setIsEditModalOpen(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Ambil data tugas untuk kalkulasi statistik
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const activeToken = token || localStorage.getItem("token");
        const res = await fetch("/api/tasks", {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });
        if (res.ok) {
          const result = await res.json();
          setTasks(result.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat statistik profil:", err);
      } finally {
        setLoadingTasks(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Statistik Tugas
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [tasks]);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari TIMO?")) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-nb-bg flex flex-col pb-24 lg:pb-12">
      <Navbar />

      <main className="flex-grow p-6 md:p-8 lg:p-10 w-full max-w-3xl mx-auto">
        {/* Tombol Kembali */}
        <div className="mb-6">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 border-nb-2 bg-nb-surface text-nb-ink px-4 py-2 font-display font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </a>
        </div>

        <div className="flex flex-col gap-8">
          {/* Card 1: Profil Utama */}
          <section className="bg-nb-surface border-nb shadow-nb-lg p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Kotak Kuning / Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-nb-yellow border-nb shadow-nb flex items-center justify-center font-display font-black text-4xl md:text-5xl text-nb-ink select-none flex-shrink-0 overflow-hidden relative">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile Photo" className="w-full h-full object-cover" />
              ) : (
                user?.username?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            {/* Detail Profil */}
            <div className="flex-grow text-center sm:text-left">
              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-nb-ink mb-1 break-words">
                {user?.username || "Nama Pengguna"}
              </h2>
              <p className="font-body text-sm font-bold uppercase tracking-wider text-nb-ink/50 mb-4">
                {getRoleLabel(user?.role)} • {user?.institution || "Sekolah / Kampus"}
              </p>

              <div className="flex flex-col gap-2.5 max-w-sm mx-auto sm:mx-0">
                <div className="flex items-center gap-3 font-body text-sm text-nb-ink/80">
                  <Mail className="w-4 h-4 text-nb-ink/60" />
                  <span className="break-all">{user?.email || "email@mahasiswa.ac.id"}</span>
                </div>
                <div className="flex items-center gap-3 font-body text-sm text-nb-ink/80">
                  <Award className="w-4 h-4 text-nb-ink/60" />
                  <span>Status: <strong className="font-bold text-nb-ink">{getRoleLabel(user?.role)}</strong></span>
                </div>
                <div className="flex items-center gap-3 font-body text-sm text-nb-ink/80">
                  <BookOpen className="w-4 h-4 text-nb-ink/60" />
                  <span className="break-words">Jurusan / Kelas: {user?.major || "Jurusan / Kelas"}</span>
                </div>
              </div>

              <div className="mt-5 flex justify-center sm:justify-start">
                <Button
                  variant="primary"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 py-1 px-3 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profil
                </Button>
              </div>
            </div>
          </section>

          {/* Card 2: Statistik Tugas */}
          <section className="bg-nb-surface border-nb shadow-nb-lg p-6 md:p-8">
            <h3 className="font-display font-black text-xl uppercase tracking-wider text-nb-ink mb-6 border-b-3 border-nb-ink pb-2">
              Statistik Tugas Saya
            </h3>

            {loadingTasks ? (
              <div className="flex flex-col gap-4">
                <Skeleton variant="text" className="w-1/3" />
                <Skeleton variant="rect" className="h-8" />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Rincian Angka */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border-nb-2 bg-nb-bg p-3 shadow-[2px_2px_0px_#1A1A1A]">
                    <p className="font-display font-extrabold text-xs text-nb-ink/50 uppercase">Total</p>
                    <p className="font-display font-black text-2xl text-nb-ink mt-0.5">{stats.total}</p>
                  </div>
                  <div className="border-nb-2 bg-[#E3F2FD] p-3 shadow-[2px_2px_0px_#1A1A1A]">
                    <p className="font-display font-extrabold text-xs text-nb-ink/50 uppercase">Aktif</p>
                    <p className="font-display font-black text-2xl text-[#1565C0] mt-0.5">{stats.total - stats.completed}</p>
                  </div>
                  <div className="border-nb-2 bg-[#F1F8E9] p-3 shadow-[2px_2px_0px_#1A1A1A]">
                    <p className="font-display font-extrabold text-xs text-nb-ink/50 uppercase">Selesai</p>
                    <p className="font-display font-black text-2xl text-[#2E7D32] mt-0.5">{stats.completed}</p>
                  </div>
                </div>

                {/* Progress Bar Neubrutalism */}
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between font-display font-extrabold text-xs uppercase tracking-wider">
                    <span>Persentase Penyelesaian</span>
                    <span>{stats.percentage}%</span>
                  </div>
                  <div className="w-full bg-nb-bg border-nb-2 h-8 flex overflow-hidden shadow-[2px_2px_0px_#1A1A1A]">
                    {stats.percentage > 0 ? (
                      <div
                        className="bg-nb-green h-full border-r-2 border-nb-ink flex items-center justify-end px-3 font-mono font-bold text-xs uppercase text-nb-ink transition-all duration-500 ease-out"
                        style={{ width: `${stats.percentage}%` }}
                      >
                        {stats.percentage}%
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-mono font-bold text-xs text-nb-ink/40">
                        0% SELESAI
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Card 3: Statistik Pomodoro */}
          <PomodoroStats />

          {/* Tombol Logout Danger */}
          <div className="flex justify-center mt-2">
            <Button
              variant="danger"
              onClick={handleLogout}
              className="flex items-center gap-2 max-w-xs w-full"
            >
              <LogOut className="w-4 h-4" />
              Keluar dari Akun (Logout)
            </Button>
          </div>
        </div>
      </main>

      {/* Navigasi Mobile (Agar tetap konsisten di mobile) */}
      <MobileNav
        onOpenSidebar={() => router.push("/dashboard?action=openSidebar")}
        onOpenAddTask={() => router.push("/dashboard?action=addTask")}
      />

      {/* Modal Edit Profil */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Ubah Profil Saya"
      >
        {formError && (
          <div className="bg-nb-red/10 border-nb-2 border-nb-red p-4 mb-5 font-body font-bold text-xs uppercase text-nb-red animate-shake">
            ⚠️ {formError}
          </div>
        )}
        {formSuccess && (
          <div className="bg-nb-green/10 border-nb-2 border-nb-green p-4 mb-5 font-body font-bold text-xs uppercase text-nb-green">
            ✅ {formSuccess}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
          <Input
            id="profile-username"
            label="Nama Lengkap *"
            placeholder="Nama Lengkap"
            value={formUsername}
            onChange={(e) => setFormUsername(e.target.value)}
            disabled={formSubmitting}
            required
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="profile-role"
              className="font-body font-bold text-sm tracking-wide text-nb-ink uppercase"
            >
              Status / Peran *
            </label>
            <select
              id="profile-role"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
              disabled={formSubmitting}
              className="w-full bg-nb-surface text-nb-ink border-nb px-4 h-12 text-base font-body focus:outline-none focus:border-nb-blue transition-colors cursor-pointer"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="pelajar">Pelajar</option>
              <option value="umum">Umum</option>
            </select>
          </div>

          <Input
            id="profile-institution"
            label="Sekolah / Kampus"
            placeholder="Sekolah / Kampus"
            value={formInstitution}
            onChange={(e) => setFormInstitution(e.target.value)}
            disabled={formSubmitting}
          />

          <Input
            id="profile-major"
            label="Jurusan / Kelas"
            placeholder="Jurusan / Kelas"
            value={formMajor}
            onChange={(e) => setFormMajor(e.target.value)}
            disabled={formSubmitting}
          />

          <Input
            id="profile-avatar"
            label="URL Foto Profil"
            placeholder="Masukkan URL Foto Profil"
            value={formAvatarUrl}
            onChange={(e) => setFormAvatarUrl(e.target.value)}
            disabled={formSubmitting}
          />

          <Input
            id="profile-password"
            label="Password Baru"
            type="password"
            placeholder="Kosongkan jika tidak ingin mengubah password"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
            disabled={formSubmitting}
          />

          <div className="flex justify-end gap-3 border-t-3 border-nb-ink/10 pt-5 mt-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              disabled={formSubmitting}
            >
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={formSubmitting}>
              {formSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
