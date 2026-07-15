import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function Card({ className, children, hoverable = false, ...props }) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, boxShadow: '0 4px 12px rgba(38,36,32,.08)' } : {}}
      className={cn(
        "sm:rounded-xl border-y sm:border-x border-paper-200 bg-white sm:bg-paper-50 sm:shadow-sm transition-shadow duration-200 overflow-hidden w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-4 border-b border-paper-200", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-lg font-display text-ink-900", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-4 sm:p-6 pb-24 sm:pb-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-paper-200 p-4 flex items-center justify-between shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.08)] sm:static sm:z-auto sm:bg-paper-100/50 sm:px-6 sm:py-4 sm:shadow-none sm:backdrop-blur-none", 
      className
    )} {...props}>
      {children}
    </div>
  );
}
