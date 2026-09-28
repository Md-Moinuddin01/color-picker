import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import type { RGBColor, HSLColor, HSVColor, CMYKColor } from '../types/color';
import { validateHex, validateRgb, validateHsl, validateHsv, validateCmyk } from '../utils/validation';
import { cmykToRgb } from './../utils/colorConversion';

interface ColorFormatsCardProps {
  hex: string;
  rgb: RGBColor;
  hsl: HSLColor;
  hsv: HSVColor;
  cmyk: CMYKColor;
  opacity: number;
  onHexChange: (hex: string) => boolean;
  onRgbChange: (rgb: Partial<RGBColor>) => void;
  onHslChange: (hsl: Partial<HSLColor>) => void;
  onHsvChange: (hsv: Partial<HSVColor>) => void;
  onOpacityChange: (a: number) => void;
  onCopyText: (text: string, label: string) => void;
}

export const ColorFormatsCard: React.FC<ColorFormatsCardProps> = ({
  hex,
  rgb,
  hsl,
  hsv,
  cmyk,
  opacity,
  onHexChange,
  onRgbChange,
  onHslChange,
  onHsvChange,
  onOpacityChange,
  onCopyText
}) => {
  // Local input string states to allow typing before validation
  const [hexInput, setHexInput] = useState(hex);
  const [rgbInput, setRgbInput] = useState(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
  const [hslInput, setHslInput] = useState(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
  const [hsvInput, setHsvInput] = useState(`${hsv.h}, ${hsv.s}%, ${hsv.v}%`);
  const [cmykInput, setCmykInput] = useState(`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`);
  const [rgbaInput, setRgbaInput] = useState(`${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}`);

  // Error messaging states
  const [hexError, setHexError] = useState<string | null>(null);
  const [rgbError, setRgbError] = useState<string | null>(null);
  const [hslError, setHslError] = useState<string | null>(null);
  const [hsvError, setHsvError] = useState<string | null>(null);
  const [cmykError, setCmykError] = useState<string | null>(null);
  const [rgbaError, setRgbaError] = useState<string | null>(null);

  // Sync inputs with outer state when outer state changes (e.g. from canvas drag)
  useEffect(() => {
    setHexInput(hex);
    setHexError(null);
  }, [hex]);

  useEffect(() => {
    setRgbInput(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
    setRgbError(null);
  }, [rgb]);

  useEffect(() => {
    setHslInput(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
    setHslError(null);
  }, [hsl]);

  useEffect(() => {
    setHsvInput(`${hsv.h}, ${hsv.s}%, ${hsv.v}%`);
    setHsvError(null);
  }, [hsv]);

  useEffect(() => {
    setCmykInput(`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`);
    setCmykError(null);
  }, [cmyk]);

  useEffect(() => {
    setRgbaInput(`${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}`);
    setRgbaError(null);
  }, [rgb, opacity]);

  // Handlers for manual keyboard input
  const handleHexInput = (val: string) => {
    setHexInput(val);
    const cleanHex = val.trim().replace(/^#/, '');
    if (validateHex(cleanHex)) {
      setHexError(null);
      onHexChange(cleanHex);
    } else {
      setHexError("That doesn't look like a valid HEX color.");
    }
  };

  const handleRgbInput = (val: string) => {
    setRgbInput(val);
    const parts = val.split(',').map((p) => parseInt(p.trim(), 10));
    if (parts.length === 3 && validateRgb(parts[0], parts[1], parts[2])) {
      setRgbError(null);
      onRgbChange({ r: parts[0], g: parts[1], b: parts[2] });
    } else {
      setRgbError('Values must be 3 comma-separated numbers (0-255).');
    }
  };

  const handleHslInput = (val: string) => {
    setHslInput(val);
    const parts = val.replace(/%/g, '').replace(/°/g, '').split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 3 && validateHsl(parts[0], parts[1], parts[2])) {
      setHslError(null);
      onHslChange({ h: parts[0], s: parts[1], l: parts[2] });
    } else {
      setHslError('Format: Hue (0-360), Saturation (0-100), Lightness (0-100).');
    }
  };

  const handleHsvInput = (val: string) => {
    setHsvInput(val);
    const parts = val.replace(/%/g, '').replace(/°/g, '').split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 3 && validateHsv(parts[0], parts[1], parts[2])) {
      setHsvError(null);
      onHsvChange({ h: parts[0], s: parts[1], v: parts[2] });
    } else {
      setHsvError('Format: Hue (0-360), Saturation (0-100), Value (0-100).');
    }
  };

  const handleCmykInput = (val: string) => {
    setCmykInput(val);
    const parts = val.replace(/%/g, '').split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 4 && validateCmyk(parts[0], parts[1], parts[2], parts[3])) {
      setCmykError(null);
      const rgbFromCmyk = cmykToRgb({ c: parts[0], m: parts[1], y: parts[2], k: parts[3] });
      onRgbChange(rgbFromCmyk);
    } else {
      setCmykError('Format: 4 comma-separated percentages (0-100).');
    }
  };

  const handleRgbaInput = (val: string) => {
    setRgbaInput(val);
    const parts = val.split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 4 && validateRgb(parts[0], parts[1], parts[2]) && !isNaN(parts[3]) && parts[3] >= 0 && parts[3] <= 1) {
      setRgbaError(null);
      onRgbChange({ r: parts[0], g: parts[1], b: parts[2] });
      onOpacityChange(parts[3]);
    } else {
      setRgbaError('Format: R, G, B (0-255), Alpha (0-1).');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-5">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Color Values</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* HEX */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">HEX</label>
          <div className="relative">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexInput(e.target.value)}
              className={`w-full font-mono text-sm py-2 px-3 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${hexError ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-400'}`}
              aria-invalid={hexError ? 'true' : 'false'}
            />
            <button
              onClick={() => onCopyText(hex, 'HEX')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              title="Copy HEX"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {hexError && <span className="text-red-500 text-[11px] leading-tight font-medium">{hexError}</span>}
        </div>

        {/* RGB */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">RGB</label>
          <div className="relative">
            <input
              type="text"
              value={rgbInput}
              onChange={(e) => handleRgbInput(e.target.value)}
              className={`w-full font-mono text-sm py-2 px-3 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${rgbError ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-400'}`}
              aria-invalid={rgbError ? 'true' : 'false'}
            />
            <button
              onClick={() => onCopyText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              title="Copy RGB"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {rgbError && <span className="text-red-500 text-[11px] leading-tight font-medium">{rgbError}</span>}
        </div>

        {/* HSL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">HSL</label>
          <div className="relative">
            <input
              type="text"
              value={hslInput}
              onChange={(e) => handleHslInput(e.target.value)}
              className={`w-full font-mono text-sm py-2 px-3 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${hslError ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-400'}`}
              aria-invalid={hslError ? 'true' : 'false'}
            />
            <button
              onClick={() => onCopyText(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              title="Copy HSL"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {hslError && <span className="text-red-500 text-[11px] leading-tight font-medium">{hslError}</span>}
        </div>

        {/* HSV */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">HSV</label>
          <div className="relative">
            <input
              type="text"
              value={hsvInput}
              onChange={(e) => handleHsvInput(e.target.value)}
              className={`w-full font-mono text-sm py-2 px-3 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${hsvError ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-400'}`}
              aria-invalid={hsvError ? 'true' : 'false'}
            />
            <button
              onClick={() => onCopyText(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`, 'HSV')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              title="Copy HSV"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {hsvError && <span className="text-red-500 text-[11px] leading-tight font-medium">{hsvError}</span>}
        </div>

        {/* CMYK */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">CMYK</label>
          <div className="relative">
            <input
              type="text"
              value={cmykInput}
              onChange={(e) => handleCmykInput(e.target.value)}
              className={`w-full font-mono text-sm py-2 px-3 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${cmykError ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-400'}`}
              aria-invalid={cmykError ? 'true' : 'false'}
            />
            <button
              onClick={() => onCopyText(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'CMYK')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              title="Copy CMYK"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {cmykError && <span className="text-red-500 text-[11px] leading-tight font-medium">{cmykError}</span>}
        </div>

        {/* RGBA / Opacity format */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">RGBA</label>
          <div className="relative">
            <input
              type="text"
              value={rgbaInput}
              onChange={(e) => handleRgbaInput(e.target.value)}
              className={`w-full font-mono text-sm py-2 px-3 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${rgbaError ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-400'}`}
              aria-invalid={rgbaError ? 'true' : 'false'}
            />
            <button
              onClick={() => onCopyText(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`, 'RGBA')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              title="Copy RGBA"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {rgbaError && <span className="text-red-500 text-[11px] leading-tight font-medium">{rgbaError}</span>}
        </div>
      </div>
    </div>
  );
};
