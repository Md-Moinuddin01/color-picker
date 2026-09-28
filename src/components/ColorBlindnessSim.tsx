import React from 'react';
import { Copy } from 'lucide-react';
import { getSimulatedHex } from '../utils/colorBlindness';

interface ColorBlindnessSimProps {
  activeColorHex: string;
  onCopyText: (text: string, label: string) => void;
}

export const ColorBlindnessSim: React.FC<ColorBlindnessSimProps> = ({
  activeColorHex,
  onCopyText
}) => {
  const simulationTypes: {
    key: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
    label: string;
    description: string;
  }[] = [
    {
      key: 'protanopia',
      label: 'Protanopia (Red Blind)',
      description: 'Deficiency in red light photoreceptors (1% of males).'
    },
    {
      key: 'deuteranopia',
      label: 'Deuteranopia (Green Blind)',
      description: 'Deficiency in green light photoreceptors (1% of males).'
    },
    {
      key: 'tritanopia',
      label: 'Tritanopia (Blue Blind)',
      description: 'Rare deficiency in blue light photoreceptors (<1% of population).'
    },
    {
      key: 'achromatopsia',
      label: 'Achromatopsia (Monochromacy)',
      description: 'Total lack of color vision. Complete grayscale vision.'
    }
  ];

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Color Blindness Simulator</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Preview how the active color appears to individuals with different vision deficiencies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {simulationTypes.map((sim) => {
          const simulatedHex = getSimulatedHex(activeColorHex, sim.key);

          return (
            <div 
              key={sim.key} 
              className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 gap-3 shadow-sm select-none"
            >
              {/* Color Block */}
              <div 
                className="w-full h-20 rounded-xl relative shadow-inner overflow-hidden flex items-end justify-between p-3"
                style={{ backgroundColor: simulatedHex }}
              >
                {/* Visual indicator in card */}
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-black/10 text-black/80 dark:bg-white/10 dark:text-white/80 select-all">
                  {simulatedHex}
                </span>

                <button
                  onClick={() => onCopyText(simulatedHex, `${sim.label} HEX`)}
                  className="p-1 rounded bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60 hover:bg-black/20 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-colors"
                  title="Copy Simulated HEX"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Meta Info */}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{sim.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {sim.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
