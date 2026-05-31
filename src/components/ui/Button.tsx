import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-display font-bold text-sm tracking-wider uppercase transition-all duration-150 ease-out focus:outline-none cursor-pointer py-3 px-6 h-12";
  
  const borderAndShadow = "border-nb shadow-nb hover:-translate-y-0.5 hover:shadow-nb-lg active:translate-y-0.5 active:shadow-[2px_2px_0px_#1A1A1A]";

  const variants = {
    primary: `${borderAndShadow} bg-nb-yellow text-nb-ink`,
    secondary: `${borderAndShadow} bg-nb-surface text-nb-ink`,
    danger: `${borderAndShadow} bg-nb-red text-white`,
    ghost: "border-3 border-transparent hover:bg-nb-ink/5 text-nb-ink active:scale-95",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
