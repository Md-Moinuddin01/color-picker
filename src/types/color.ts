export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RGBAColor extends RGBColor {
  a: number;
}

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface CMYKColor {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
  rgba: string;
}

export interface SavedColor {
  id: string;
  hex: string;
  name: string;
  timestamp: number;
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  timestamp: number;
}

export interface ContrastResult {
  ratio: number;
  aaNormal: 'pass' | 'fail';
  aaaNormal: 'pass' | 'fail';
  aaLarge: 'pass' | 'fail';
  aaaLarge: 'pass' | 'fail';
}

export type VisionType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
