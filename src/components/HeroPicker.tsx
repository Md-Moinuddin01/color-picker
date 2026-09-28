import React, { useRef, useEffect, useState } from 'react';
import { Eye, Shuffle, RefreshCw } from 'lucide-react';
import type { HSVColor, RGBColor } from '../types/color';
import { hsvToRgb, rgbToHex } from '../utils/colorConversion';

interface HeroPickerProps {
  hsv: HSVColor;
  rgb: RGBColor;
  opacity: number;
  onHsvChange: (hsv: Partial<HSVColor>) => void;
  onOpacityChange: (a: number) => void;
  onRandomColor: () => void;
  onHexChange: (hex: string) => boolean;
}

export const HeroPicker: React.FC<HeroPickerProps> = ({
  hsv,
  rgb,
  opacity,
  onHsvChange,
  onOpacityChange,
  onRandomColor,
  onHexChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasEyeDropper, setHasEyeDropper] = useState(false);

  // Check for Eyedropper API support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      setHasEyeDropper(true);
    }
  }, []);

  // Handle Eyedropper activation
  const handleEyeDropper = async () => {
    if (!hasEyeDropper) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      if (result && result.sRGBHex) {
        onHexChange(result.sRGBHex);
      }
    } catch (err) {
      console.warn('Eyedropper was cancelled or failed:', err);
    }
  };

  // Canvas interaction logic (Saturation & Value dragging)
  const updateColorFromCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Calculate percentage relative to canvas size
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    
    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);
    
    onHsvChange({ s, v });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    canvasRef.current?.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateColorFromCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateColorFromCoords(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    canvasRef.current?.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  // Keyboard navigation for saturation/value box
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let step = 1;
    if (e.shiftKey) step = 10;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onHsvChange({ v: Math.min(100, hsv.v + step) });
        break;
      case 'ArrowDown':
        e.preventDefault();
        onHsvChange({ v: Math.max(0, hsv.v - step) });
        break;
      case 'ArrowRight':
        e.preventDefault();
        onHsvChange({ s: Math.min(100, hsv.s + step) });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onHsvChange({ s: Math.max(0, hsv.s - step) });
        break;
    }
  };

  // Cursor offset coordinates
  const cursorLeft = `${hsv.s}%`;
  const cursorTop = `${100 - hsv.v}%`;

  // Color representing 100% saturation/value for the canvas background
  const hueBgColor = `hsl(${hsv.h}, 100%, 50%)`;

  // RGBA string for opacity slider track gradient representation
  const startColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`;
  const endColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Color Picker</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Pick, explore, and save beautiful colors in seconds.
        </p>
      </div>

      {/* Main 2D SV Saturation/Value Canvas Box */}
      <div
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Saturation and Value picker. Use arrow keys to adjust. Shift + Arrow key for larger adjustments."
        className="w-full h-64 rounded-2xl relative cursor-crosshair overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 select-none"
        style={{ backgroundColor: hueBgColor }}
      >
        {/* White Saturation Overlay (left to right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        
        {/* Black Value Overlay (bottom to top) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        {/* Selection Cursor handle */}
        <div
          className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-lg pointer-events-none transition-transform duration-75 flex items-center justify-center"
          style={{
            left: cursorLeft,
            top: cursorTop,
            backgroundColor: rgbToHex(hsvToRgb(hsv)),
            transform: isDragging ? 'scale(1.2)' : 'scale(1)'
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
        </div>
      </div>

      {/* Control Sliders */}
      <div className="flex flex-col gap-4">
        {/* Hue Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Hue</span>
            <span>{hsv.h}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={hsv.h}
            onChange={(e) => onHsvChange({ h: parseInt(e.target.value, 10) })}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950 shadow-inner"
            style={{
              background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
            }}
            aria-label="Hue angle"
          />
        </div>

        {/* Opacity Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Opacity</span>
            <span>{Math.round(opacity * 100)}%</span>
          </div>
          <div className="relative w-full h-3 rounded-lg bg-checkerboard overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full appearance-none cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              style={{
                backgroundImage: `linear-gradient(to right, ${startColor}, ${endColor})`
              }}
              aria-label="Opacity value"
            />
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-3 mt-1">
          {hasEyeDropper && (
            <button
              onClick={handleEyeDropper}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              title="Activate Eyedropper Tool"
            >
              <Eye className="w-4 h-4" />
              <span>Eyedropper</span>
            </button>
          )}
          <button
            onClick={onRandomColor}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            title="Randomize Color (R)"
          >
            <Shuffle className="w-4 h-4" />
            <span>Randomize</span>
          </button>
          <button
            onClick={() => {
              onHsvChange({ h: 243, s: 61, v: 100 });
              onOpacityChange(1);
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-slate-500 active:rotate-180 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            title="Reset color to default (#6C63FF)"
            aria-label="Reset color"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
