import React, { useContext } from 'react';
import { WizardContext } from '../../state/WizardContext';
import { Stepper } from '../shared/Stepper';
import { motion, AnimatePresence } from 'motion/react';

export function WizardLayout({ children }) {
  const { state } = useContext(WizardContext);

  return (
    <div className="min-h-screen flex flex-col items-center sm:p-8 bg-paper-50 sm:bg-paper-100">
      <header className="w-full max-w-4xl px-4 pt-6 pb-2 sm:px-0 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display text-primary-900 text-center mb-1 sm:mb-2">Admit Card Generator</h1>
        <p className="text-xs sm:text-base text-ink-600 text-center max-w-2xl mx-auto mb-4 sm:mb-0">Generate print-ready exam admit cards for your classes in minutes.</p>
        <div className="sm:mt-4">
          <Stepper currentStep={state.currentStep} />
        </div>
      </header>
      
      <main className="w-full max-w-3xl flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
