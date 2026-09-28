import type { RGBColor } from '../types/color';
import { rgbToHex, hexToRgb } from './colorConversion';

export function simulateProtanopia({ r, g, b }: RGBColor): RGBColor {
  return {
    r: Math.round(0.567 * r + 0.433 * g + 0.0 * b),
    g: Math.round(0.558 * r + 0.442 * g + 0.0 * b),
    b: Math.round(0.0 * r + 0.242 * g + 0.758 * b)
  };
}

export function simulateDeuteranopia({ r, g, b }: RGBColor): RGBColor {
  return {
    r: Math.round(0.625 * r + 0.375 * g + 0.0 * b),
    g: Math.round(0.7 * r + 0.3 * g + 0.0 * b),
    b: Math.round(0.0 * r + 0.3 * g + 0.7 * b)
  };
}

export function simulateTritanopia({ r, g, b }: RGBColor): RGBColor {
  return {
    r: Math.round(0.95 * r + 0.05 * g + 0.0 * b),
    g: Math.round(0.0 * r + 0.433 * g + 0.567 * b),
    b: Math.round(0.0 * r + 0.475 * g + 0.525 * b)
  };
}

export function simulateAchromatopsia({ r, g, b }: RGBColor): RGBColor {
  // Classic NTSC grayscale formula
  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  return { r: gray, g: gray, b: gray };
}

export function getSimulatedHex(hex: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'): string {
  const rgb = hexToRgb(hex);
  let simulatedRgb = rgb;

  switch (type) {
    case 'protanopia':
      simulatedRgb = simulateProtanopia(rgb);
      break;
    case 'deuteranopia':
      simulatedRgb = simulateDeuteranopia(rgb);
      break;
    case 'tritanopia':
      simulatedRgb = simulateTritanopia(rgb);
      break;
    case 'achromatopsia':
      simulatedRgb = simulateAchromatopsia(rgb);
      break;
  }

  // Ensure RGB values are bound within 0-255
  simulatedRgb.r = Math.max(0, Math.min(255, simulatedRgb.r));
  simulatedRgb.g = Math.max(0, Math.min(255, simulatedRgb.g));
  simulatedRgb.b = Math.max(0, Math.min(255, simulatedRgb.b));

  return rgbToHex(simulatedRgb).toUpperCase();
}
