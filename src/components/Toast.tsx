import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClear: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClear }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClear();
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-slate-800 dark:border-slate-200 flex items-center gap-2 transform animate-fade-in transition-all duration-300">
        <span className="text-sm font-semibold">{message}</span>
        <span className="text-emerald-500 dark:text-emerald-600 font-bold text-sm">✓</span>
      </div>
    </div>
  );
};
