import React from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

const steps = [
  { id: 1, name: "School Profile" },
  { id: 2, name: "Exam Details" },
  { id: 3, name: "Class Selection" },
  { id: 4, name: "Subject Setup" },
  { id: 5, name: "Exam Schedule" },
  { id: 6, name: "Student Data" },
  { id: 7, name: "Review & Generate" },
];

export function Stepper({ currentStep }) {
  return (
    <div className="sticky top-16 z-30 w-full bg-white border border-slate-200 rounded-2xl px-3 py-3 sm:px-5 shadow-sm">
      <ol className="flex items-center w-full" aria-label="Progress">
        {steps.map((step, stepIdx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = stepIdx === steps.length - 1;

          return (
            <li
              key={step.id}
              className={cn("flex items-center min-w-0", !isLast && "flex-1")}
            >
              <motion.span
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  backgroundColor: isCompleted
                    ? "#10b981"
                    : isCurrent
                      ? "#f59e0b"
                      : "#f1f5f9",
                  color: isCompleted || isCurrent ? "#ffffff" : "#64748b",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className="size-7 shrink-0 flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  boxShadow: isCurrent
                    ? "0 4px 12px rgba(245, 158, 11, 0.35)"
                    : "none",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isCompleted ? "done" : step.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex items-center justify-center"
                  >
                    {isCompleted ? (
                      <Check className="size-4 stroke-[3]" />
                    ) : (
                      step.id
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
              <AnimatePresence mode="wait" initial={false}>
                {isCurrent && (
                  <motion.span
                    key={`label-${step.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                    className="ml-2 text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap truncate max-w-[120px] sm:max-w-none"
                  >
                    {step.name}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isLast && (
                <div className="flex-1 min-w-[4px] h-[2px] mx-1.5 sm:mx-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    className="h-full w-full rounded-full origin-left"
                    initial={false}
                    animate={{
                      scaleX: currentStep > step.id ? 1 : 0,
                      backgroundColor:
                        currentStep > step.id ? "#10b981" : "#f59e0b",
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
