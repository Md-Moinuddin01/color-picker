import React from 'react';
import { Copy } from 'lucide-react';

interface CssExportProps {
  hex: string;
  onCopyText: (text: string, label: string) => void;
}

export const CssExport: React.FC<CssExportProps> = ({ hex, onCopyText }) => {
  const rootSnippet = `:root {\n  --color-primary: ${hex};\n}`;
  const colorSnippet = `color: ${hex};`;
  const bgSnippet = `background-color: ${hex};`;
  const borderSnippet = `border-color: ${hex};`;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Use this color (CSS)</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Copy developer-friendly CSS rules directly into your stylesheets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CSS Variable */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">CSS Variable</span>
          <div className="relative">
            <pre className="font-mono text-xs p-3.5 pr-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 text-slate-800 dark:text-slate-200 select-all overflow-x-auto whitespace-pre">
              {rootSnippet}
            </pre>
            <button
              onClick={() => onCopyText(rootSnippet, 'CSS Variable snippet')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              title="Copy snippet"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Declarations */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Declarations</span>
          
          <div className="space-y-2">
            {/* Color */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 font-mono text-xs text-slate-800 dark:text-slate-200">
              <span className="select-all">{colorSnippet}</span>
              <button
                onClick={() => onCopyText(colorSnippet, 'color property')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                title="Copy declaration"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Background-color */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 font-mono text-xs text-slate-800 dark:text-slate-200">
              <span className="select-all">{bgSnippet}</span>
              <button
                onClick={() => onCopyText(bgSnippet, 'background-color property')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                title="Copy declaration"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Border-color */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 font-mono text-xs text-slate-800 dark:text-slate-200">
              <span className="select-all">{borderSnippet}</span>
              <button
                onClick={() => onCopyText(borderSnippet, 'border-color property')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                title="Copy declaration"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
