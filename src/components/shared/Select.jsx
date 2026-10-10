import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle } from "lucide-react";

export const Select = React.forwardRef(
  ({ className, label, error, helperText, children, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && (
          <label className="text-sm font-medium text-ink-900">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-paper-200 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors appearance-none",
            error && "border-error focus:ring-error",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <div className="flex items-center text-xs text-error mt-1">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            {error}
          </div>
        )}
        {!error && helperText && (
          <p className="text-xs text-ink-600 mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
