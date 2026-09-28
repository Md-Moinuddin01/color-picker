import type { RGBColor, HSLColor } from '../types/color';
import { rgbToHsl, hslToRgb, rgbToHex } from './colorConversion';

function hslToHex(hsl: HSLColor): string {
  const rgb = hslToRgb(hsl);
  return rgbToHex(rgb).toUpperCase();
}

export function generateComplementary(rgb: RGBColor): string[] {
  const hsl = rgbToHsl(rgb);
  const compH = (hsl.h + 180) % 360;

  return [
    rgbToHex(rgb).toUpperCase(),
    hslToHex({ h: compH, s: hsl.s, l: Math.max(10, hsl.l - 15) }),
    hslToHex({ h: compH, s: Math.max(10, hsl.s - 10), l: hsl.l }),
    hslToHex({ h: compH, s: hsl.s, l: hsl.l }),
    hslToHex({ h: hsl.h, s: hsl.s, l: Math.min(90, hsl.l + 20) }),
  ];
}

export function generateAnalogous(rgb: RGBColor): string[] {
  const hsl = rgbToHsl(rgb);

  return [
    hslToHex({ h: (hsl.h + 330) % 360, s: hsl.s, l: hsl.l }),
    hslToHex({ h: (hsl.h + 345) % 360, s: hsl.s, l: hsl.l }),
    rgbToHex(rgb).toUpperCase(),
    hslToHex({ h: (hsl.h + 15) % 360, s: hsl.s, l: hsl.l }),
    hslToHex({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l }),
  ];
}

export function generateTriadic(rgb: RGBColor): string[] {
  const hsl = rgbToHsl(rgb);
  const h1 = (hsl.h + 120) % 360;
  const h2 = (hsl.h + 240) % 360;

  return [
    hslToHex({ h: h1, s: hsl.s, l: Math.max(10, hsl.l - 10) }),
    hslToHex({ h: h1, s: hsl.s, l: hsl.l }),
    rgbToHex(rgb).toUpperCase(),
    hslToHex({ h: h2, s: hsl.s, l: hsl.l }),
    hslToHex({ h: h2, s: hsl.s, l: Math.min(90, hsl.l + 15) }),
  ];
}

export function generateSplitComplementary(rgb: RGBColor): string[] {
  const hsl = rgbToHsl(rgb);
  const h1 = (hsl.h + 150) % 360;
  const h2 = (hsl.h + 210) % 360;

  return [
    hslToHex({ h: h1, s: hsl.s, l: hsl.l }),
    hslToHex({ h: h1, s: hsl.s, l: Math.max(15, hsl.l - 10) }),
    rgbToHex(rgb).toUpperCase(),
    hslToHex({ h: h2, s: hsl.s, l: Math.max(15, hsl.l - 10) }),
    hslToHex({ h: h2, s: hsl.s, l: hsl.l }),
  ];
}

export function generateMonochromatic(rgb: RGBColor): string[] {
  const hsl = rgbToHsl(rgb);

  return [
    hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(10, hsl.l - 30) }),
    hslToHex({ h: hsl.h, s: Math.max(10, hsl.s - 20), l: Math.max(20, hsl.l - 15) }),
    rgbToHex(rgb).toUpperCase(),
    hslToHex({ h: hsl.h, s: hsl.s, l: Math.min(90, hsl.l + 15) }),
    hslToHex({ h: hsl.h, s: Math.max(10, hsl.s - 30), l: Math.min(95, hsl.l + 30) }),
  ];
}

export interface PaletteGroup {
  complementary: string[];
  analogous: string[];
  triadic: string[];
  splitComplementary: string[];
  monochromatic: string[];
}

export function generateAllPalettes(rgb: RGBColor): PaletteGroup {
  return {
    complementary: generateComplementary(rgb),
    analogous: generateAnalogous(rgb),
    triadic: generateTriadic(rgb),
    splitComplementary: generateSplitComplementary(rgb),
    monochromatic: generateMonochromatic(rgb),
  };
}
