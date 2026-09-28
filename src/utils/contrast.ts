import type { RGBColor, ContrastResult } from '../types/color';

export function getRelativeLuminance({ r, g, b }: RGBColor): number {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

export function getContrastRatio(rgb1: RGBColor, rgb2: RGBColor): number {
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);

  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function checkContrast(foreground: RGBColor, background: RGBColor): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    aaNormal: ratio >= 4.5 ? 'pass' : 'fail',
    aaaNormal: ratio >= 7.0 ? 'pass' : 'fail',
    aaLarge: ratio >= 3.0 ? 'pass' : 'fail',
    aaaLarge: ratio >= 4.5 ? 'pass' : 'fail'
  };
}

// Helper to determine if text color should be black or white for contrast on a solid color block
export function getIdealTextColor(bg: RGBColor): string {
  const luminance = getRelativeLuminance(bg);
  return luminance > 0.179 ? '#000000' : '#FFFFFF';
}
