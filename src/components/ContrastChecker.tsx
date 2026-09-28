import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, X, Info } from 'lucide-react';
import type { RGBColor } from '../types/color';
import { checkContrast } from '../utils/contrast';
import { hexToRgb } from '../utils/colorConversion';
import { validateHex } from '../utils/validation';

interface ContrastCheckerProps {
  activeColorHex: string;
  activeColorRgb: RGBColor;
}

export const ContrastChecker: React.FC<ContrastCheckerProps> = ({
  activeColorHex,
  activeColorRgb
}) => {
  const [fgHex, setFgHex] = useState('#000000');
  const [bgHex, setBgHex] = useState(activeColorHex);

  const [fgRgb, setFgRgb] = useState<RGBColor>({ r: 0, g: 0, b: 0 });
  const [bgRgb, setBgRgb] = useState<RGBColor>(activeColorRgb);

  // Sync background with active color when active color updates
  useEffect(() => {
    setBgHex(activeColorHex);
    setBgRgb(activeColorRgb);
  }, [activeColorHex, activeColorRgb]);

  // Handle changes in FG
  const handleFgChange = (val: string) => {
    setFgHex(val);
    const clean = val.trim().replace(/^#/, '');
    if (validateHex(clean)) {
      setFgRgb(hexToRgb(clean));
    }
  };

  // Handle changes in BG
  const handleBgChange = (val: string) => {
    setBgHex(val);
    const clean = val.trim().replace(/^#/, '');
    if (validateHex(clean)) {
      setBgRgb(hexToRgb(clean));
    }
  };

  // Quick setters based on active color
  const setAsForeground = () => {
    setFgHex(activeColorHex);
    setFgRgb(activeColorRgb);
  };

  const setAsBackground = () => {
    setBgHex(activeColorHex);
    setBgRgb(activeColorRgb);
  };

  // Swap FG and BG colors
  const handleSwap = () => {
    const tempHex = fgHex;
    const tempRgb = fgRgb;
    setFgHex(bgHex);
    setFgRgb(bgRgb);
    setBgHex(tempHex);
    setBgRgb(tempRgb);
  };

  // Perform WCAG evaluation
  const result = checkContrast(fgRgb, bgRgb);

  const getBadgeStyle = (status: 'pass' | 'fail') => {
    return status === 'pass'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30'
      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/30';
  };

  return (
    <section id="contrast-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-6 scroll-mt-20">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contrast Checker</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Evaluate color accessibility based on Web Content Accessibility Guidelines (WCAG 2.1).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Color pickers inputs */}
        <div className="flex flex-col gap-4">
          {/* Foreground (Text) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Foreground (Text)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={fgHex}
                  onChange={(e) => handleFgChange(e.target.value)}
                  className="w-full font-mono text-sm py-2 px-3 pl-10 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <span
                  className="absolute left-3 top-3 w-4 h-4 rounded-md border border-slate-200 dark:border-slate-800"
                  style={{ backgroundColor: fgHex }}
                />
              </div>
              <button
                onClick={setAsForeground}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 dark:hover:text-white transition-colors"
                title="Use active color as foreground"
              >
                Use Picker
              </button>
            </div>
          </div>

          {/* Swap Trigger */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              title="Swap Foreground and Background"
              aria-label="Swap colors"
            >
              <ArrowLeftRight className="w-4 h-4 rotate-90 lg:rotate-0" />
            </button>
          </div>

          {/* Background */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Background</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={bgHex}
                  onChange={(e) => handleBgChange(e.target.value)}
                  className="w-full font-mono text-sm py-2 px-3 pl-10 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <span
                  className="absolute left-3 top-3 w-4 h-4 rounded-md border border-slate-200 dark:border-slate-800"
                  style={{ backgroundColor: bgHex }}
                />
              </div>
              <button
                onClick={setAsBackground}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 dark:hover:text-white transition-colors"
                title="Use active color as background"
              >
                Use Picker
              </button>
            </div>
          </div>
        </div>

        {/* Results Metrics Display */}
        <div className="flex flex-col justify-center items-center gap-4 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 select-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contrast Ratio</span>
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {result.ratio}:1
          </span>
          
          <div className="grid grid-cols-2 gap-3 w-full mt-2">
            {/* AA Normal */}
            <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${getBadgeStyle(result.aaNormal)}`}>
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">AA Normal</span>
              <div className="flex items-center gap-1 mt-0.5">
                {result.aaNormal === 'pass' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span className="text-xs font-bold uppercase">{result.aaNormal}</span>
              </div>
            </div>

            {/* AAA Normal */}
            <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${getBadgeStyle(result.aaaNormal)}`}>
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">AAA Normal</span>
              <div className="flex items-center gap-1 mt-0.5">
                {result.aaaNormal === 'pass' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span className="text-xs font-bold uppercase">{result.aaaNormal}</span>
              </div>
            </div>

            {/* AA Large */}
            <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${getBadgeStyle(result.aaLarge)}`}>
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">AA Large</span>
              <div className="flex items-center gap-1 mt-0.5">
                {result.aaLarge === 'pass' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span className="text-xs font-bold uppercase">{result.aaLarge}</span>
              </div>
            </div>

            {/* AAA Large */}
            <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${getBadgeStyle(result.aaaLarge)}`}>
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">AAA Large</span>
              <div className="flex items-center gap-1 mt-0.5">
                {result.aaaLarge === 'pass' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span className="text-xs font-bold uppercase">{result.aaaLarge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Typography Preview */}
        <div 
          className="rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 overflow-hidden"
          style={{ backgroundColor: bgHex }}
        >
          <div className="flex flex-col gap-1" style={{ color: fgHex }}>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Normal Text (14px)</span>
            <p className="text-sm font-medium leading-relaxed">
              Pack my box with five dozen liquor jugs. Good contrast improves readability and accessibility.
            </p>
          </div>

          <hr className="opacity-15" style={{ borderColor: fgHex }} />

          <div className="flex flex-col gap-1" style={{ color: fgHex }}>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Large Text (18px Bold)</span>
            <p className="text-lg font-bold leading-tight">
              Design is accessibility.
            </p>
          </div>
        </div>

      </div>

      {/* Info tag */}
      <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-900">
        <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
        <span className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          <strong>Accessibility Note:</strong> Normal text requires a contrast ratio of at least 4.5:1 (AA) or 7:1 (AAA). Large text (18pt/24px normal weight or 14pt/18.67px bold weight) requires a ratio of at least 3.0:1 (AA) or 4.5:1 (AAA).
        </span>
      </div>
    </section>
  );
};
