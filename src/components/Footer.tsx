import React from 'react';
import { Palette } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand details */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
              ColorPick
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            An open, simple color tool for everyone.
          </p>
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-800 dark:hover:text-white transition-colors">
            Picker
          </button>
          <button onClick={() => scrollToSection('palette-section')} className="hover:text-slate-800 dark:hover:text-white transition-colors">
            Palette
          </button>
          <button onClick={() => scrollToSection('contrast-section')} className="hover:text-slate-800 dark:hover:text-white transition-colors">
            Contrast
          </button>
          <button onClick={() => scrollToSection('gradient-section')} className="hover:text-slate-800 dark:hover:text-white transition-colors">
            Gradient
          </button>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 dark:hover:text-white transition-colors">
            GitHub
          </a>
        </div>

        {/* Copy/Attribution */}
        <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Built for designers & developers.
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} ColorPick. Open Source.
          </span>
        </div>

      </div>
    </footer>
  );
};
