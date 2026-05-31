import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect";
}

export default function Skeleton({ className = "", variant = "rect" }: SkeletonProps) {
  const baseStyle = "shimmer border-nb-2 bg-gray-200 w-full";
  
  const variantStyles = {
    text: "h-4 my-2",
    rect: "h-24",
  };

  return (
    <div
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      role="progressbar"
      aria-busy="true"
    />
  );
}
