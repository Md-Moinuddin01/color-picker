import React, { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { validateHex } from '../utils/validation';

interface GradientGeneratorProps {
  activeColorHex: string;
  onCopyText: (text: string, label: string) => void;
}

export const GradientGenerator: React.FC<GradientGeneratorProps> = ({
  activeColorHex,
  onCopyText
}) => {
  const [color1, setColor1] = useState(activeColorHex);
  const [color2, setColor2] = useState('#FF6584');
  const [angle, setAngle] = useState(90);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

  // Sync color1 with active picker color on quick command
  const setAsColor1 = () => {
    setColor1(activeColorHex);
  };

  const setAsColor2 = () => {
    setColor2(activeColorHex);
  };

  const handleSwap = () => {
    const temp = color1;
    setColor1(color2);
    setColor2(temp);
  };

  // Compile CSS output
  const gradientCss = gradientType === 'linear'
    ? `background: linear-gradient(${angle}deg, ${color1}, ${color2});`
    : `background: radial-gradient(circle, ${color1}, ${color2});`;

  return (
    <section id="gradient-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-6 scroll-mt-20">
      
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gradient Generator</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Design beautiful gradients, customize direction, and export CSS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <div className="flex flex-col gap-4">
          
          {/* Gradient type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gradient Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={() => setGradientType('linear')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${gradientType === 'linear' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/30 dark:border-slate-850' : 'text-slate-500'}`}
              >
                Linear
              </button>
              <button
                onClick={() => setGradientType('radial')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${gradientType === 'radial' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/30 dark:border-slate-850' : 'text-slate-500'}`}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Color 1 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Color Start</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-full font-mono text-sm py-2 px-3 pl-10 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <input
                  type="color"
                  value={validateHex(color1) ? color1 : '#FFFFFF'}
                  onChange={(e) => setColor1(e.target.value.toUpperCase())}
                  className="absolute left-2.5 top-2.5 w-5 h-5 rounded-md border-0 p-0 cursor-pointer overflow-hidden opacity-0"
                />
                <span
                  className="absolute left-3 top-3 w-4 h-4 rounded-md border border-slate-200 dark:border-slate-800 pointer-events-none"
                  style={{ backgroundColor: color1 }}
                />
              </div>
              <button
                onClick={setAsColor1}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 dark:hover:text-white transition-colors"
              >
                Use Picker
              </button>
            </div>
          </div>

          {/* Swap start/end & details */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              title="Swap Colors"
              aria-label="Swap colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Color 2 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Color End</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-full font-mono text-sm py-2 px-3 pl-10 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <input
                  type="color"
                  value={validateHex(color2) ? color2 : '#FFFFFF'}
                  onChange={(e) => setColor2(e.target.value.toUpperCase())}
                  className="absolute left-2.5 top-2.5 w-5 h-5 rounded-md border-0 p-0 cursor-pointer overflow-hidden opacity-0"
                />
                <span
                  className="absolute left-3 top-3 w-4 h-4 rounded-md border border-slate-200 dark:border-slate-800 pointer-events-none"
                  style={{ backgroundColor: color2 }}
                />
              </div>
              <button
                onClick={setAsColor2}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 dark:hover:text-white transition-colors"
              >
                Use Picker
              </button>
            </div>
          </div>

          {/* Angle Slider - Only visible for Linear gradient */}
          {gradientType === 'linear' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Angle</span>
                <span>{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                className="w-full h-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          )}

        </div>

        {/* Live Canvas Preview Column */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner h-64 lg:h-auto select-none bg-checkerboard relative">
          <div 
            className="absolute inset-0 transition-all duration-300"
            style={{
              backgroundImage: gradientType === 'linear'
                ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
                : `radial-gradient(circle, ${color1}, ${color2})`
            }}
          />
        </div>

        {/* Code Output Column */}
        <div className="flex flex-col justify-between bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CSS Code</span>
            <pre className="font-mono text-[11px] leading-relaxed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-xl text-slate-850 dark:text-slate-250 select-all whitespace-pre-wrap break-all h-32 overflow-y-auto">
              {gradientCss}
            </pre>
          </div>

          <button
            onClick={() => onCopyText(gradientCss, 'CSS Gradient code')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <Copy className="w-4 h-4" />
            <span>Copy CSS</span>
          </button>
        </div>

      </div>
    </section>
  );
};
