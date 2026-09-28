import type { RGBColor, HSLColor, HSVColor, CMYKColor, ColorFormats } from '../types/color';

export function rgbToHex({ r, g, b }: RGBColor): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const hexPart = (val: number) => {
    const hex = clamp(val).toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${hexPart(r)}${hexPart(g)}${hexPart(b)}`;
}

export function rgbaToHex({ r, g, b, a }: RGBColor & { a: number }): string {
  const hex = rgbToHex({ r, g, b });
  const alphaPart = Math.max(0, Math.min(255, Math.round(a * 255))).toString(16).toUpperCase();
  return hex + (alphaPart.length === 1 ? '0' + alphaPart : alphaPart);
}

export function hexToRgb(hex: string): RGBColor {
  const cleanHex = hex.trim().replace(/^#/, '');
  let r = 0, g = 0, b = 0;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6 || cleanHex.length === 8) {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  }
  return { r, g, b };
}

export function rgbToHsl({ r, g, b }: RGBColor): HSLColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb({ h, s, l }: HSLColor): RGBColor {
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
    b: Math.round(b * 255),
  };
}

export function rgbToHsv({ r, g, b }: RGBColor): HSVColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

export function hsvToRgb({ h, s, v }: HSVColor): RGBColor {
  h /= 360;
  s /= 100;
  v /= 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0, g = 0, b = 0;

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function rgbToCmyk({ r, g, b }: RGBColor): CMYKColor {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  const kPercent = Math.round(k * 100);

  return { c, m, y, k: kPercent };
}

export function cmykToRgb({ c, m, y, k }: CMYKColor): RGBColor {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return { r, g, b };
}

export function formatHex(hex: string): string {
  return hex.toUpperCase();
}

export function formatRgb({ r, g, b }: RGBColor): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatRgba({ r, g, b, a }: RGBColor & { a: number }): string {
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

export function formatHsl({ h, s, l }: HSLColor): string {
  return `hsl(${h}°, ${s}%, ${l}%)`;
}

export function formatHsv({ h, s, v }: HSVColor): string {
  return `hsv(${h}°, ${s}%, ${v}%)`;
}

export function formatCmyk({ c, m, y, k }: CMYKColor): string {
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
}

export function getColorFormats(rgb: RGBColor, a: number): ColorFormats {
  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);

  return {
    hex: hex.toUpperCase(),
    rgb: formatRgb(rgb),
    rgba: formatRgba({ ...rgb, a }),
    hsl: formatHsl(hsl),
    hsv: formatHsv(hsv),
    cmyk: formatCmyk(cmyk)
  };
}
