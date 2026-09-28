import React from 'react';
import { X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative z-10 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 id="shortcuts-title" className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Keyboard Shortcuts
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-350 text-sm font-medium">Copy HEX Color</span>
            <kbd className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              C
            </kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-350 text-sm font-medium">Generate Random Color</span>
            <kbd className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              R
            </kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-350 text-sm font-medium">Save Color to Favorites</span>
            <kbd className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              S
            </kbd>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-600 dark:text-slate-350 text-sm font-medium">Toggle Shortcuts Help</span>
            <kbd className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              ?
            </kbd>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700 text-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
