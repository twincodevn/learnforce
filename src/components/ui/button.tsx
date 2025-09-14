"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "default" | "xp" | "streak" | "achievement" | "heart";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg hover:shadow-xl";

    const variants = {
      primary: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 border-b-4 border-green-700 hover:border-green-800 active:border-b-2",
      secondary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 border-b-4 border-blue-700 hover:border-blue-800 active:border-b-2",
      outline: "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 shadow-none hover:shadow-none",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 border-b-4 border-red-700 hover:border-red-800 active:border-b-2",
      default: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 border-b-4 border-green-700 hover:border-green-800 active:border-b-2",
      xp: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 focus:ring-orange-500 border-b-4 border-orange-600 hover:border-orange-700 active:border-b-2",
      streak: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500 border-b-4 border-indigo-700 hover:border-indigo-800 active:border-b-2",
      achievement: "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 focus:ring-purple-500 border-b-4 border-pink-700 hover:border-pink-800 active:border-b-2",
      heart: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-500 border-b-4 border-pink-600 hover:border-pink-700 active:border-b-2",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm h-9",
      md: "px-6 py-3 text-sm h-12",
      lg: "px-8 py-4 text-base h-14",
      xl: "px-10 py-5 text-lg h-16",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
