export function validateHex(hex: string): boolean {
  const cleanHex = hex.trim().replace(/^#/, '');
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{4}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/.test(cleanHex);
}

export function validateRgb(r: number, g: number, b: number): boolean {
  return (
    !isNaN(r) && r >= 0 && r <= 255 &&
    !isNaN(g) && g >= 0 && g <= 255 &&
    !isNaN(b) && b >= 0 && b <= 255
  );
}

export function validateRgba(r: number, g: number, b: number, a: number): boolean {
  return (
    validateRgb(r, g, b) &&
    !isNaN(a) && a >= 0 && a <= 1
  );
}

export function validateHsl(h: number, s: number, l: number): boolean {
  return (
    !isNaN(h) && h >= 0 && h <= 360 &&
    !isNaN(s) && s >= 0 && s <= 100 &&
    !isNaN(l) && l >= 0 && l <= 100
  );
}

export function validateHsv(h: number, s: number, v: number): boolean {
  return (
    !isNaN(h) && h >= 0 && h <= 360 &&
    !isNaN(s) && s >= 0 && s <= 100 &&
    !isNaN(v) && v >= 0 && v <= 100
  );
}

export function validateCmyk(c: number, m: number, y: number, k: number): boolean {
  return (
    !isNaN(c) && c >= 0 && c <= 100 &&
    !isNaN(m) && m >= 0 && m <= 100 &&
    !isNaN(y) && y >= 0 && y <= 100 &&
    !isNaN(k) && k >= 0 && k <= 100
  );
}

export interface ParsedColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export function parseColorInput(input: string): ParsedColor | null {
  const str = input.trim().toLowerCase();

  // 1. HEX Format
  if (str.startsWith('#') || /^[0-9a-f]{3,8}$/.test(str)) {
    const cleanHex = str.startsWith('#') ? str.slice(1) : str;
    if (!validateHex(cleanHex)) return null;

    let r = 0, g = 0, b = 0, a = 1;

    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 4) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
      a = parseInt(cleanHex[3] + cleanHex[3], 16) / 255;
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.slice(0, 2), 16);
      g = parseInt(cleanHex.slice(2, 4), 16);
      b = parseInt(cleanHex.slice(4, 6), 16);
    } else if (cleanHex.length === 8) {
      r = parseInt(cleanHex.slice(0, 2), 16);
      g = parseInt(cleanHex.slice(2, 4), 16);
      b = parseInt(cleanHex.slice(4, 6), 16);
      a = parseInt(cleanHex.slice(6, 8), 16) / 255;
    }
    return { r, g, b, a: parseFloat(a.toFixed(2)) };
  }

  // 2. RGB / RGBA Format
  const rgbMatch = str.match(/rgba?\(?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)?/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : undefined;

    if (validateRgba(r, g, b, a !== undefined ? a : 1)) {
      return { r, g, b, a };
    }
  }

  // 3. HSL / HSLA Format
  const hslMatch = str.match(/hsla?\(?\s*(\d+)(?:deg|°)?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+)\s*)?\)?/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    const a = hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : undefined;

    if (validateHsl(h, s, l)) {
      // Convert HSL to RGB for unified output
      const { r, g, b } = hslToRgb(h, s, l);
      return { r, g, b, a };
    }
  }

  return null;
}

// Simple HSL to RGB internal converter for input parsing
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r = 0, g = 0, b = 0;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
