import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

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
  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="w-full sm:w-64 shrink-0 bg-white sm:rounded-2xl sm:border border-slate-200 p-6 flex flex-col">
      <div className="mb-8 hidden sm:block">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-900">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {progressPercentage}% complete
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      </div>

      <nav aria-label="Progress" className="hidden sm:block">
        <ol role="list" className="flex flex-col space-y-0">
          {steps.map((step, stepIdx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <li
                key={step.id}
                className={cn(
                  "relative flex items-start",
                  stepIdx !== steps.length - 1 ? "pb-6" : "",
                )}
              >
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-8 left-3.5 -ml-px h-full w-[2px] transition-colors duration-300",
                      isCompleted ? "bg-emerald-500" : "bg-slate-200",
                    )}
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-center justify-center shrink-0">
                  <span
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 z-10",
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-110"
                          : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4 stroke-[3]" />
                    ) : (
                      step.id
                    )}
                  </span>
                </div>
                <div className="ml-4 flex flex-col pt-0.5">
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      isCompleted || isCurrent
                        ? "text-slate-900"
                        : "text-slate-500",
                    )}
                  >
                    {step.name}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium mt-0.5 transition-colors duration-300",
                      isCompleted
                        ? "text-slate-500"
                        : isCurrent
                          ? "text-amber-600"
                          : "text-slate-400",
                    )}
                  >
                    {isCompleted
                      ? "Completed"
                      : isCurrent
                        ? "In Progress"
                        : "Pending"}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="sm:hidden flex flex-col w-full">
        <div className="flex items-center justify-between text-sm font-bold text-slate-900 mb-2">
          <span>
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-amber-500">
            {steps.find((s) => s.id === currentStep)?.name}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
