import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Copy, Heart, Shuffle, Download, Upload } from 'lucide-react';
import type { RGBColor } from '../types/color';
import { generateAllPalettes } from '../utils/palette';
import { getIdealTextColor } from '../utils/contrast';
import { getNearestColorName } from '../utils/colorNames';

interface PaletteGeneratorProps {
  activeColorHex: string;
  activeColorRgb: RGBColor;
  onSelectColor: (hex: string) => void;
  onCopyText: (text: string, label: string) => void;
  onSaveFavorites: (colors: string[]) => void;
}

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'splitComplementary' | 'monochromatic';

export const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({
  activeColorHex,
  activeColorRgb,
  onSelectColor,
  onCopyText,
  onSaveFavorites
}) => {
  const [activeTab, setActiveTab] = useState<HarmonyType>('complementary');
  
  // 5 slots in the generated palette. We track locked colors (swatches that don't update when main picker updates).
  const [lockedColors, setLockedColors] = useState<boolean[]>([false, false, false, false, false]);
  const [paletteColors, setPaletteColors] = useState<string[]>([]);
  const [importInput, setImportInput] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Generate palettes based on active color
  const allPalettes = generateAllPalettes(activeColorRgb);

  // Update palette colors when active color or tab changes, respecting locked slots
  useEffect(() => {
    const freshHarmony = allPalettes[activeTab];
    setPaletteColors((prev) => {
      // If no prev palette (initial load), just return fresh
      if (prev.length === 0) return freshHarmony;

      // Update only unlocked slots
      return prev.map((color, index) => {
        if (lockedColors[index]) return color;
        return freshHarmony[index] || color;
      });
    });
  }, [activeColorHex, activeColorRgb, activeTab]);

  // Toggle lock state for a specific slot
  const toggleLock = (index: number) => {
    setLockedColors((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // Shuffle unlocked slots randomly
  const handleShuffle = () => {
    setPaletteColors((prev) => {
      return prev.map((color, index) => {
        if (lockedColors[index]) return color;
        // Generate random beautiful hex color
        const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`.toUpperCase();
      });
    });
  };

  // Copy entire palette as HEX values (comma separated)
  const handleCopyPalette = () => {
    const list = paletteColors.join(', ');
    onCopyText(list, 'Palette Colors');
  };

  // Export palette as CSS variables snippet
  const handleExportCss = () => {
    const cssSnippet = `:root {\n` +
      paletteColors.map((color, idx) => `  --color-palette-${idx + 1}: ${color};`).join('\n') +
      `\n}`;
    onCopyText(cssSnippet, 'CSS Palette Variables');
  };

  // Export palette as JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(paletteColors, null, 2);
    onCopyText(jsonStr, 'JSON Palette');
  };

  // Import custom palette string
  const handleImportPalette = (e: React.FormEvent) => {
    e.preventDefault();
    const regex = /#?([0-9A-Fa-f]{3,8})/g;
    const matches = importInput.match(regex) || [];
    
    if (matches.length > 0) {
      const parsedColors = matches.slice(0, 5).map((c) => {
        let clean = c.trim();
        if (!clean.startsWith('#')) clean = '#' + clean;
        return clean.toUpperCase();
      });

      // Pad color length to 5 if less imported
      while (parsedColors.length < 5) {
        parsedColors.push('#FFFFFF');
      }

      setPaletteColors(parsedColors);
      setLockedColors([false, false, false, false, false]);
      setIsImportOpen(false);
      setImportInput('');
    }
  };

  const harmonyOptions: { value: HarmonyType; label: string }[] = [
    { value: 'complementary', label: 'Complementary' },
    { value: 'analogous', label: 'Analogous' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'splitComplementary', label: 'Split' },
    { value: 'monochromatic', label: 'Monochromatic' }
  ];

  return (
    <section id="palette-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-6 scroll-mt-20">
      
      {/* Header details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Color Harmonies</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Generate mathematical palette combinations based on color theory.
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-slate-500 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            title="Shuffle unlocked colors (Space)"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
          
          <button
            onClick={handleCopyPalette}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-slate-500 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy HEXs</span>
          </button>

          <button
            onClick={handleExportCss}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-slate-500 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            title="Copy as CSS variables"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSS Variables</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-slate-500 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            title="Copy palette as JSON array"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => onSaveFavorites(paletteColors)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Save Palette</span>
          </button>

          <button
            onClick={() => setIsImportOpen(!isImportOpen)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-slate-500 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Import Drawer overlay */}
      {isImportOpen && (
        <form onSubmit={handleImportPalette} className="flex gap-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <input
            type="text"
            placeholder="Paste HEX codes (e.g. #6C63FF, #FF6584, #333333)"
            value={importInput}
            onChange={(e) => setImportInput(e.target.value)}
            className="flex-1 font-mono text-sm py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-xs"
          >
            Load
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 overflow-x-auto scrollbar-none">
        {harmonyOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveTab(opt.value)}
            className={`py-2.5 px-4 font-semibold text-sm transition-all focus:outline-none shrink-0 border-b-2 -mb-[2px] ${activeTab === opt.value ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Colors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {paletteColors.map((color, index) => {
          const colorName = getNearestColorName(color);
          const rgb = {
            r: parseInt(color.slice(1, 3), 16),
            g: parseInt(color.slice(3, 5), 16),
            b: parseInt(color.slice(5, 7), 16),
          };
          const textOverlayColor = getIdealTextColor(rgb);

          return (
            <div 
              key={index} 
              className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {/* Color Block */}
              <div 
                className="w-full h-32 relative cursor-pointer flex flex-col justify-between p-3 select-none"
                style={{ backgroundColor: color }}
                onClick={() => onSelectColor(color)}
                title="Select this color in the picker"
              >
                {/* Lock Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(index);
                  }}
                  className="self-end p-1.5 rounded-lg bg-black/10 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/25 dark:hover:bg-white/20"
                  style={{ color: textOverlayColor }}
                  title={lockedColors[index] ? 'Unlock Color' : 'Lock Color'}
                >
                  {lockedColors[index] ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>

                {/* Color Value Label */}
                <div className="flex flex-col" style={{ color: textOverlayColor }}>
                  <span className="font-mono font-bold text-sm leading-tight">{color}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80 truncate">{colorName}</span>
                </div>
              </div>

              {/* Card actions */}
              <div className="flex border-t border-slate-200 dark:border-slate-800 text-xs font-semibold divide-x divide-slate-200 dark:divide-slate-800 bg-slate-50 dark:bg-slate-950">
                <button
                  onClick={() => onCopyText(color, 'Color HEX')}
                  className="flex-1 flex items-center justify-center py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  title="Copy HEX"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => onSelectColor(color)}
                  className="flex-1 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Pick
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
