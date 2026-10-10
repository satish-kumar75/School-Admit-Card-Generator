import { useContext } from "react";
import { WizardContext } from "../../state/WizardContext";
import { Stepper } from "../shared/Stepper";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, GraduationCap } from "lucide-react";

export const WizardLayout = ({ children }) => {
  const { state, dispatch } = useContext(WizardContext);

  const handleReset = () => {
    if (window.confirm("Reset all fields to blank?")) {
      dispatch({ type: "RESET_WIZARD" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body transition-colors duration-200 flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 size-[500px] bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 size-[450px] bg-teal-500/10 rounded-full blur-[140px]" />
      </div>

      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-600 text-white shadow-sm">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display leading-tight">
                Admit Card Studio
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight hidden sm:block">
                Generate print-ready exam admit cards in minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset all fields"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent transition-all cursor-pointer"
            >
              <RotateCcw className="size-4 shrink-0" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 flex flex-col sm:flex-row gap-8 items-start">
        <div className="w-full sm:w-72 shrink-0 flex flex-col sticky top-28">
          <Stepper currentStep={state.currentStep} />
        </div>

        <div className="w-full flex-1 min-w-0 flex flex-col">
          <main className="w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
