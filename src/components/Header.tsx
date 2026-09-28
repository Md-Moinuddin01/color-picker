import React from 'react';
import { Sun, Moon, HelpCircle, Palette } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode, onOpenShortcuts }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/20">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            ColorPick
          </span>
        </div>

        {/* Navigation - Hidden on Mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white transition-colors">
            Picker
          </button>
          <button onClick={() => scrollToSection('palette-section')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white transition-colors">
            Palette
          </button>
          <button onClick={() => scrollToSection('contrast-section')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white transition-colors">
            Contrast
          </button>
          <button onClick={() => scrollToSection('gradient-section')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white transition-colors">
            Gradient
          </button>
          <button onClick={() => scrollToSection('favorites-section')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white transition-colors">
            Favorites
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Shortcuts Info */}
          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <span className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
            aria-label="Source code on GitHub"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
          </a>
        </div>

      </div>
    </header>
  );
};
