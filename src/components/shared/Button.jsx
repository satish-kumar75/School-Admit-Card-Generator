import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export function Button({
  children,
  variant = "primary",
  className,
  isLoading,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-paper-50 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
    secondary:
      "bg-white text-ink-900 border border-paper-200 hover:bg-paper-100 focus:ring-primary-500",
    outline:
      "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500",
    ghost:
      "text-ink-600 hover:text-ink-900 hover:bg-paper-100 focus:ring-primary-500",
    accent:
      "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={cn(baseStyles, variants[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
}
