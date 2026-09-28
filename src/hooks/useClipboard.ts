import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  timeout?: number;
  onCopy?: (text: string) => void;
}

export function useClipboard({ timeout = 2000, onCopy }: UseClipboardOptions = {}) {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(
    async (value: string) => {
      if (typeof window === 'undefined') return false;

      try {
        await navigator.clipboard.writeText(value);
        setHasCopied(true);
        if (onCopy) onCopy(value);

        setTimeout(() => {
          setHasCopied(false);
        }, timeout);

        return true;
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = value;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (successful) {
            setHasCopied(true);
            if (onCopy) onCopy(value);
            setTimeout(() => setHasCopied(false), timeout);
            return true;
          }
        } catch (fallbackErr) {
          console.error('Fallback clipboard copy failed:', fallbackErr);
        }
        return false;
      }
    },
    [timeout, onCopy]
  );

  return { hasCopied, copy };
}
