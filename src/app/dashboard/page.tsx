"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import StatCard from "@/components/tasks/StatCard";
import FilterBar from "@/components/tasks/FilterBar";
import TaskGrid from "@/components/tasks/TaskGrid";
import EmptyState from "@/components/tasks/EmptyState";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { Task } from "@/components/tasks/TaskCard";
import { ClipboardList, Hourglass, CheckCircle2, Plus } from "lucide-react";

export default function DashboardPage() {
  const { user, token } = useAuth();
  
  // State Tugas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State Filter & Urutan
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all"); // "all", "individual", "group"
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("deadline-asc");

  // State UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // State Form Modal
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formPriority, setFormPriority] = useState<"high" | "medium" | "low">("medium");
  const [formStatus, setFormStatus] = useState<"todo" | "inprogress" | "done">("todo");
  const [formDeadline, setFormDeadline] = useState("");
  const [formIsGroup, setFormIsGroup] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Ambil data tugas dari API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data tugas");
      }

      const result = await res.json();
      setTasks(result.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat mengambil tugas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // List mata kuliah unik untuk filter di sidebar
  const availableSubjects = useMemo(() => {
    const subs = tasks.map((t) => t.subject).filter(Boolean);
    return Array.from(new Set(subs));
  }, [tasks]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  // Kalkulasi statistik ringkasan
  const stats = useMemo(() => {
    const total = tasks.length;
    const active = tasks.filter((t) => t.status !== "done").length;
    const completed = tasks.filter((t) => t.status === "done").length;
    return { total, active, completed };
  }, [tasks]);

  // Memfilter dan mengurutkan tugas
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    // Filter Status
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        result = result.filter((t) => t.status !== "done");
      } else {
        result = result.filter((t) => t.status === statusFilter);
      }
    }

    // Filter Prioritas
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Filter Tipe Tugas
    if (taskTypeFilter === "individual") {
      result = result.filter((t) => !t.is_group);
    } else if (taskTypeFilter === "group") {
      result = result.filter((t) => t.is_group);
    }

    // Filter Mata Kuliah
    if (selectedSubjects.length > 0) {
      result = result.filter((t) => selectedSubjects.includes(t.subject));
    }

    // Pengurutan
    result.sort((a, b) => {
      if (sortBy === "deadline-asc") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === "deadline-desc") {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      }
      if (sortBy === "created-desc") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "created-asc") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, taskTypeFilter, selectedSubjects, sortBy]);

  // Buka modal untuk tugas baru
  const handleNewTaskClick = () => {
    setEditingTask(null);
    setFormTitle("");
    setFormDescription("");
    setFormSubject("");
    setFormPriority("medium");
    setFormStatus("todo");
    setFormIsGroup(false);
    
    // Set default deadline ke besok
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormDeadline(tomorrow.toISOString().split("T")[0]);
    
    setFormError(null);
    setModalOpen(true);
  };

  // Buka modal untuk edit tugas
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormSubject(task.subject);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormIsGroup(task.is_group);
    
    // Format deadline YYYY-MM-DD
    try {
      setFormDeadline(new Date(task.deadline).toISOString().split("T")[0]);
    } catch (e) {
      setFormDeadline("");
    }
    
    setFormError(null);
    setModalOpen(true);
  };

  // Tambah / Edit Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle || !formSubject || !formDeadline) {
      setFormError("Judul, mata kuliah, dan tenggat waktu wajib diisi");
      return;
    }

    setFormSubmitting(true);
    try {
      const activeToken = token || localStorage.getItem("token");
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
      const method = editingTask ? "PUT" : "POST";

      const payload = {
        title: formTitle,
        description: formDescription,
        subject: formSubject,
        priority: formPriority,
        status: formStatus,
        deadline: formDeadline,
        is_group: formIsGroup,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal menyimpan tugas");
      }

      setModalOpen(false);
      // Reload tugas
      fetchTasks();
    } catch (err: any) {
      setFormError(err.message || "Gagal menyimpan tugas");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Hapus tugas
  const handleDeleteClick = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;

    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus tugas");
      }

      // Reload tugas
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus tugas");
    }
  };

  // Ubah status tugas (toggle cepat)
  const handleToggleStatus = async (task: Task) => {
    const nextStatusMap: Record<string, "todo" | "inprogress" | "done"> = {
      todo: "inprogress",
      inprogress: "done",
      done: "todo",
    };

    const nextStatus = nextStatusMap[task.status] || "todo";

    try {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengubah status");
      }

      fetchTasks();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-nb-bg flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex-grow flex flex-row relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          status={statusFilter}
          setStatus={setStatusFilter}
          priority={priorityFilter}
          setPriority={setPriorityFilter}
          taskType={taskTypeFilter}
          setTaskType={setTaskTypeFilter}
          selectedSubjects={selectedSubjects}
          toggleSubject={toggleSubject}
          availableSubjects={availableSubjects}
        />

        {/* Dashboard Main Content */}
        <main className="flex-grow p-6 md:p-8 lg:p-10 w-full max-w-7xl mx-auto lg:pb-12 pb-24">
          {/* Header dashboard */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-black text-3xl md:text-4xl text-nb-ink uppercase tracking-wider leading-none mb-2">
                Halo, {user?.username || "Pengguna"}! 👋
              </h1>
              <p className="font-body text-sm md:text-base text-nb-ink/70">
                Kamu memiliki <strong className="text-nb-ink font-bold">{stats.active} tugas aktif</strong> yang sedang berjalan.
              </p>
            </div>
            
            <Button
              variant="primary"
              onClick={handleNewTaskClick}
              className="hidden lg:flex items-center gap-2 self-start"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              Tambah Tugas Baru
            </Button>
          </div>

          {/* Grid Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Tugas"
              value={stats.total}
              icon={ClipboardList}
              variant="yellow"
            />
            <StatCard
              title="Tugas Aktif"
              value={stats.active}
              icon={Hourglass}
              variant="blue"
            />
            <StatCard
              title="Tugas Selesai"
              value={stats.completed}
              icon={CheckCircle2}
              variant="green"
            />
          </div>

          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            status={statusFilter}
            setStatus={setStatusFilter}
            taskType={taskTypeFilter}
            setTaskType={setTaskTypeFilter}
          />

          {/* List Tugas */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Skeleton variant="rect" className="h-44" />
              <Skeleton variant="rect" className="h-44" />
              <Skeleton variant="rect" className="h-44" />
            </div>
          ) : error ? (
            <div className="bg-nb-red/10 border-nb-2 border-nb-red p-6 text-center text-nb-red font-bold uppercase tracking-wider text-sm shadow-nb">
              ⚠️ {error}
              <button
                onClick={fetchTasks}
                className="block mx-auto mt-4 px-4 py-2 border-nb-2 bg-nb-surface text-nb-ink text-xs cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState onAddTask={handleNewTaskClick} />
          ) : (
            <TaskGrid
              tasks={filteredTasks}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
              onUpdateMembers={fetchTasks}
            />
          )}
        </main>
      </div>

      {/* Navigasi Mobile Bawah */}
      <MobileNav
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenAddTask={handleNewTaskClick}
      />

      {/* Modal Form Tambah / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? "Ubah Tugas" : "Tambah Tugas Baru"}
      >
        {formError && (
          <div className="bg-nb-red/10 border-nb-2 border-nb-red p-4 mb-5 font-body font-bold text-xs uppercase text-nb-red">
            ⚠️ {formError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          <Input
            id="task-title"
            label="Judul Tugas *"
            placeholder="Contoh: Buat ERD Sistem Retail"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            disabled={formSubmitting}
            required
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-description"
              className="font-body font-bold text-sm tracking-wide text-nb-ink uppercase"
            >
              Deskripsi Tugas
            </label>
            <textarea
              id="task-description"
              placeholder="Jelaskan detail instruksi tugas di sini..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              disabled={formSubmitting}
              className="w-full bg-nb-surface text-nb-ink border-nb px-4 py-3 h-24 text-base font-body placeholder:text-gray-400 focus:outline-none focus:border-nb-blue transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              id="task-subject"
              label="Mata Kuliah *"
              placeholder="Contoh: RPL, Basis Data"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              disabled={formSubmitting}
              required
            />

            <div className="flex flex-col gap-2">
              <label
                htmlFor="task-priority"
                className="font-body font-bold text-sm tracking-wide text-nb-ink uppercase"
              >
                Prioritas *
              </label>
              <select
                id="task-priority"
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as any)}
                disabled={formSubmitting}
                className="w-full bg-nb-surface text-nb-ink border-nb px-4 h-12 text-base font-body focus:outline-none focus:border-nb-blue transition-colors cursor-pointer"
              >
                <option value="high">🔴 Tinggi (High)</option>
                <option value="medium">🟡 Sedang (Medium)</option>
                <option value="low">🟢 Rendah (Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              id="task-deadline"
              label="Tenggat Waktu *"
              type="date"
              value={formDeadline}
              onChange={(e) => setFormDeadline(e.target.value)}
              disabled={formSubmitting}
              required
            />

            <div className="flex flex-col gap-2">
              <label
                htmlFor="task-status"
                className="font-body font-bold text-sm tracking-wide text-nb-ink uppercase"
              >
                Status *
              </label>
              <select
                id="task-status"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                disabled={formSubmitting}
                className="w-full bg-nb-surface text-nb-ink border-nb px-4 h-12 text-base font-body focus:outline-none focus:border-nb-blue transition-colors cursor-pointer"
              >
                <option value="todo">🔘 Belum Dimulai</option>
                <option value="inprogress">🔵 Sedang Dikerjakan</option>
                <option value="done">🟢 Selesai</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="task-is-group"
              checked={formIsGroup}
              onChange={(e) => setFormIsGroup(e.target.checked)}
              disabled={formSubmitting || !!editingTask}
              className="w-4 h-4 text-nb-yellow bg-nb-surface border-nb-2 focus:ring-nb-yellow focus:ring-2"
            />
            <label htmlFor="task-is-group" className="font-body font-bold text-sm text-nb-ink">
              Jadikan Tugas Kelompok (Anda bisa mengundang anggota setelah dibuat)
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t-3 border-nb-ink/10 pt-5 mt-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={formSubmitting}
            >
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={formSubmitting}>
              {formSubmitting ? "Menyimpan..." : "Simpan Tugas"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
