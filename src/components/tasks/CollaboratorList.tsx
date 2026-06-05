import React, { useState } from "react";
import { UserPlus, X, Shield, User } from "lucide-react";

export interface TaskMember {
  id: number;
  user_id: number;
  role: "owner" | "member";
  joined_at: string;
  users: {
    id: number;
    username: string;
    email: string;
  };
}

interface CollaboratorListProps {
  taskId: number;
  members: TaskMember[];
  currentUserId: number;
  isOwner: boolean;
  onAddMember: (email: string) => Promise<void>;
  onRemoveMember: (userId: number) => Promise<void>;
}

export default function CollaboratorList({
  taskId,
  members,
  currentUserId,
  isOwner,
  onAddMember,
  onRemoveMember,
}: CollaboratorListProps) {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await onAddMember(emailInput.trim());
      setEmailInput("");
    } catch (err: any) {
      setError(err.message || "Gagal mengundang anggota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t-2 border-nb-ink/10 pt-4">
      <h3 className="font-display font-extrabold uppercase tracking-wider text-sm mb-3 text-nb-ink">
        Anggota Tugas ({members.length})
      </h3>

      {/* Member List */}
      <div className="flex flex-col gap-2 mb-4 max-h-40 overflow-y-auto">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2 border-nb-2 bg-nb-surface rounded-none"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-nb-yellow border-nb-2 text-nb-ink font-bold uppercase text-xs">
                {member.users.username.substring(0, 2)}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-nb-ink truncate">
                  {member.users.username} {member.user_id === currentUserId ? "(Anda)" : ""}
                </span>
                <span className="text-xs text-nb-ink/60 truncate flex items-center gap-1">
                  {member.role === "owner" ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {member.role === "owner" ? "Pemilik" : "Anggota"}
                </span>
              </div>
            </div>

            {/* Actions */}
            {(isOwner || member.user_id === currentUserId) && member.role !== "owner" && (
              <button
                onClick={() => onRemoveMember(member.user_id)}
                className="p-1.5 text-nb-red hover:bg-nb-red/10 border-nb-2 border-transparent hover:border-nb-red transition-colors"
                title={member.user_id === currentUserId ? "Keluar dari tugas" : "Keluarkan anggota"}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Invite Form (Only for Owner) */}
      {isOwner && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          {error && <p className="text-nb-red text-xs font-bold">{error}</p>}
          <div className="flex gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email anggota..."
              className="flex-1 px-3 py-2 text-sm border-nb-2 bg-nb-bg focus:outline-none focus:shadow-[2px_2px_0px_#1A1A1A] transition-shadow placeholder:text-nb-ink/40"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !emailInput.trim()}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-nb-yellow border-nb-2 font-bold text-sm text-nb-ink hover:bg-nb-yellow/80 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all disabled:opacity-50 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Undang</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
