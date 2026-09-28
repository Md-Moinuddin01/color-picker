import React from 'react';
import { Trash2 } from 'lucide-react';

interface ColorHistoryProps {
  recentColors: string[];
  onSelectColor: (hex: string) => void;
  onClearHistory: () => void;
}

export const ColorHistory: React.FC<ColorHistoryProps> = ({
  recentColors,
  onSelectColor,
  onClearHistory
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Colors</h3>
        {recentColors.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-450 transition-colors text-xs font-semibold"
            title="Clear all recent history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {recentColors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center select-none">
          <p className="text-slate-400 dark:text-slate-550 text-sm font-medium">
            Your recent colors will appear here.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 flex-wrap max-h-36 overflow-y-auto">
          {recentColors.map((color, index) => (
            <button
              key={index}
              onClick={() => onSelectColor(color)}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              style={{ backgroundColor: color }}
              title={`Restore ${color}`}
              aria-label={`Restore recent color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
