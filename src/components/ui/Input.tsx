import React, { forwardRef } from "react";
import { AlertTriangle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="font-body font-bold text-sm tracking-wide text-nb-ink uppercase"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full bg-nb-surface text-nb-ink border-nb px-4 py-3 h-12 text-base font-body placeholder:text-gray-400 focus:outline-none focus:border-nb-blue transition-colors ${
            error ? "border-nb-red focus:border-nb-red" : "border-nb"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs font-bold text-nb-red flex items-center gap-1 mt-0.5" role="alert">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
