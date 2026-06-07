import React, { useEffect, useState } from "react";
import { Star, Flame, Trophy, X } from "lucide-react";

interface RewardNotificationProps {
  pointsEarned: number;
  currentStreak: number;
  isNewRecord: boolean;
  onClose: () => void;
}

export default function RewardNotification({
  pointsEarned,
  currentStreak,
  isNewRecord,
  onClose,
}: RewardNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animasi masuk
    setTimeout(() => setIsVisible(true), 100);

    // Auto close setelah 5 detik
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-20 right-4 md:right-8 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-nb-green border-nb border-nb-ink shadow-nb-lg p-6 max-w-sm relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 hover:bg-nb-ink/10 transition-colors border-2 border-transparent hover:border-nb-ink"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[3] text-nb-ink" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-nb-ink p-2 border-nb-2 border-nb-ink">
            <Star className="w-6 h-6 stroke-[3] text-nb-green" />
          </div>
          <h4 className="font-display font-black text-xl text-nb-ink uppercase tracking-wide">
            Tugas Selesai! 🎉
          </h4>
        </div>

        {/* Points Earned */}
        <div className="bg-nb-surface border-nb-2 border-nb-ink p-4 mb-3">
          <div className="flex items-center justify-between">
            <span className="font-body font-bold text-sm uppercase text-nb-ink/70">
              Poin Didapat
            </span>
            <span className="font-display font-black text-2xl text-nb-ink">
              +{pointsEarned} ⭐
            </span>
          </div>
        </div>

        {/* Streak Info */}
        <div className="bg-nb-surface border-nb-2 border-nb-ink p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 stroke-[2.5] text-nb-orange" />
              <span className="font-body font-bold text-sm uppercase text-nb-ink/70">
                Streak
              </span>
            </div>
            <span className="font-display font-black text-2xl text-nb-ink">
              {currentStreak} 🔥
            </span>
          </div>
        </div>

        {/* New Record Badge */}
        {isNewRecord && (
          <div className="bg-nb-ink text-nb-surface border-nb-2 border-nb-ink p-3 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 stroke-[3]" />
              <span className="font-body font-black text-xs uppercase tracking-wider">
                🏆 Rekor Baru! Streak Terpanjang! 🏆
              </span>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <p className="font-body text-sm text-nb-ink/70 mt-4 text-center">
          {pointsEarned >= 75
            ? "Luar biasa! Kamu menyelesaikan tugas jauh sebelum deadline! 🚀"
            : pointsEarned >= 50
            ? "Bagus! Kamu menyelesaikan tugas tepat waktu! 👏"
            : "Tetap semangat! Selesaikan lebih cepat untuk poin lebih banyak! 💪"}
        </p>
      </div>
    </div>
  );
}
