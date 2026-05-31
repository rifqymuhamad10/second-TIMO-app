/**
 * Menghasilkan warna background tint, border, dan aksen secara deterministik
 * berdasarkan nama mata kuliah untuk desain Neubrutalism.
 */
export function getSubjectColor(subjectName: string) {
  const name = subjectName.trim().toLowerCase();

  if (name.includes("rpl") || name.includes("rekayasa perangkat lunak")) {
    return {
      bg: "bg-[#FFFDE7]", // Yellow tint
      accent: "bg-[#F9A825] text-nb-ink",
      border: "border-[#F9A825]",
    };
  }

  if (name.includes("basis data") || name.includes("database") || name.includes("bd")) {
    return {
      bg: "bg-[#E3F2FD]", // Blue tint
      accent: "bg-[#1565C0] text-white",
      border: "border-[#1565C0]",
    };
  }

  if (name.includes("pbo") || name.includes("pemrograman berorientasi objek") || name.includes("java")) {
    return {
      bg: "bg-[#FCE4EC]", // Pink/Red tint
      accent: "bg-[#C62828] text-white",
      border: "border-[#C62828]",
    };
  }

  if (name.includes("sistem operasi") || name.includes("os") || name.includes("so")) {
    return {
      bg: "bg-[#E8F5E9]", // Green tint
      accent: "bg-[#2E7D32] text-white",
      border: "border-[#2E7D32]",
    };
  }

  // Mata kuliah lainnya (Default)
  return {
    bg: "bg-nb-surface", // White
    accent: "bg-gray-500 text-white",
    border: "border-gray-500",
  };
}
