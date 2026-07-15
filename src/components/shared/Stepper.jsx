import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const steps = [
  { id: 1, name: 'School Profile' },
  { id: 2, name: 'Exam Details' },
  { id: 3, name: 'Class Selection' },
  { id: 4, name: 'Subject Setup' },
  { id: 5, name: 'Exam Schedule' },
  { id: 6, name: 'Student Data' },
  { id: 7, name: 'Review & Generate' },
];

export function Stepper({ currentStep }) {
  return (
    <div className="w-full py-4 sm:py-6">
      <nav aria-label="Progress" className="hidden sm:block">
        <ol role="list" className="flex items-center justify-between">
          {steps.map((step, stepIdx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <li key={step.name} className={cn("relative", stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "")}>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden sm:block" style={{ width: 'calc(100% - 1rem)' }} aria-hidden="true">
                    <div className={cn(
                      "h-[2px] w-full bg-paper-200 transition-colors duration-300",
                      isCompleted ? "bg-primary-500" : ""
                    )} />
                  </div>
                )}
                <div className="relative flex items-center justify-center group">
                  <span className="h-9 flex items-center">
                    <span className={cn(
                      "relative z-10 w-8 h-8 flex items-center justify-center bg-paper-50 border-2 rounded-full transition-colors duration-300",
                      isCompleted ? "border-primary-500 bg-primary-500" : 
                      isCurrent ? "border-accent-500 bg-white" : "border-paper-200 bg-white"
                    )}>
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className={cn(
                          "text-sm font-medium",
                          isCurrent ? "text-accent-600" : "text-ink-400"
                        )}>{step.id}</span>
                      )}
                    </span>
                  </span>
                  <span className="absolute top-10 text-xs font-medium w-max text-center hidden sm:block">
                    <span className={cn(
                      "transition-colors duration-300",
                      isCompleted ? "text-primary-900" :
                      isCurrent ? "text-accent-600" : "text-ink-400"
                    )}>{step.name}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
      {/* Mobile view text */}
      <div className="mt-4 sm:hidden text-center">
        <p className="text-sm font-medium text-ink-900">
          Step {currentStep} of {steps.length} — {steps.find(s => s.id === currentStep)?.name}
        </p>
        <div className="mt-2 w-full bg-paper-200 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
