import React from 'react';
import { Copy, Heart } from 'lucide-react';
import type { RGBColor, HSLColor } from '../types/color';
import { getIdealTextColor } from '../utils/contrast';

interface ColorPreviewCardProps {
  hex: string;
  rgb: RGBColor;
  hsl: HSLColor;
  opacity: number;
  colorName: string;
  onCopyText: (text: string, label: string) => void;
  onSaveFavorite: () => void;
  isFavorite: boolean;
}

export const ColorPreviewCard: React.FC<ColorPreviewCardProps> = ({
  hex,
  rgb,
  hsl,
  opacity,
  colorName,
  onCopyText,
  onSaveFavorite,
  isFavorite
}) => {
  // Generate RGBA background style
  const rgbaStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

  // Calculate high contrast text overlay for the color card
  const textColor = getIdealTextColor(rgb);

  // Formatting strings
  const hexString = opacity < 1 
    ? `${hex}${Math.round(opacity * 255).toString(16).toUpperCase().padStart(2, '0')}`
    : hex;
  const rgbString = opacity < 1
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.toFixed(2)})`
    : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = opacity < 1
    ? `hsla(${hsl.h}°, ${hsl.s}%, ${hsl.l}%, ${opacity.toFixed(2)})`
    : `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Top Banner Details */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          Selected Color
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
          {colorName}
        </span>
      </div>

      {/* Large Color Block Area */}
      <div className="relative flex-1 min-h-[170px] bg-checkerboard flex items-end p-5 select-none group">
        {/* Dynamic color layer */}
        <div
          className="absolute inset-0 transition-colors duration-75"
          style={{ backgroundColor: rgbaStyle }}
        />
        
        {/* Color HEX code text on top of color block */}
        <div 
          className="relative z-10 flex flex-col transition-opacity duration-200"
          style={{ color: textColor }}
        >
          <span className="text-3xl font-black tracking-tight drop-shadow-sm font-mono">
            {hexString}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-85">
            {opacity < 1 ? 'RGBA' : 'HEX'} Preview
          </span>
        </div>

        {/* Floating Save button */}
        <button
          onClick={onSaveFavorite}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 shadow-lg text-slate-700 hover:text-rose-500 dark:text-slate-300 dark:hover:text-rose-400 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400 border border-slate-200/50 dark:border-slate-800/50"
          title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites (S)'}
          aria-label={isFavorite ? 'Remove color from favorites' : 'Save color to favorites'}
        >
          <Heart 
            className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} 
          />
        </button>
      </div>

      {/* Quick Action buttons */}
      <div className="p-5 flex flex-col gap-3">
        {/* Copy HEX */}
        <button
          onClick={() => onCopyText(hexString, 'HEX')}
          className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono"
        >
          <span className="text-slate-400 uppercase text-xs tracking-wider font-sans font-medium">HEX</span>
          <span>{hexString}</span>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Copy RGB */}
        <button
          onClick={() => onCopyText(rgbString, 'RGB')}
          className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono"
        >
          <span className="text-slate-400 uppercase text-xs tracking-wider font-sans font-medium">{opacity < 1 ? 'RGBA' : 'RGB'}</span>
          <span className="truncate max-w-[200px]">{rgbString}</span>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Copy HSL */}
        <button
          onClick={() => onCopyText(hslString, 'HSL')}
          className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono"
        >
          <span className="text-slate-400 uppercase text-xs tracking-wider font-sans font-medium">{opacity < 1 ? 'HSLA' : 'HSL'}</span>
          <span className="truncate max-w-[200px]">{hslString}</span>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
