import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onCopyHex: () => void;
  onRandomColor: () => void;
  onSaveColor: () => void;
  onToggleShortcuts: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case 'c':
          event.preventDefault();
          handlers.onCopyHex();
          break;
        case 'r':
          event.preventDefault();
          handlers.onRandomColor();
          break;
        case 's':
          event.preventDefault();
          handlers.onSaveColor();
          break;
        case '?':
        case '/': // Fallback if Shift+? is pressed
          if (event.key === '?' || event.key === '/') {
            event.preventDefault();
            handlers.onToggleShortcuts();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}
