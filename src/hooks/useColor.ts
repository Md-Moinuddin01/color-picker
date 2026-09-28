import { useState, useEffect, useCallback, useMemo } from 'react';
import type { RGBColor, HSLColor, HSVColor, SavedColor } from '../types/color';
import {
  hsvToRgb,
  rgbToHsv,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  hexToRgb,
  rgbToCmyk
} from '../utils/colorConversion';
import { getNearestColorName } from '../utils/colorNames';
import { useLocalStorage } from './useLocalStorage';
import { validateHex } from '../utils/validation';

export function useColor() {
  // 1. Initial color determination from URL parameter
  const getInitialColor = (): HSVColor => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const colorParam = params.get('color');
      if (colorParam && validateHex(colorParam)) {
        const rgb = hexToRgb(colorParam);
        return rgbToHsv(rgb);
      }
    }
    // Default color is #6C63FF (Royal Purple/Electric Indigo)
    return { h: 243, s: 61, v: 100 };
  };

  // 2. Main Color State (HSV is best for dragging picker controls)
  const [hsv, setHsv] = useState<HSVColor>(getInitialColor);
  const [opacity, setOpacity] = useState<number>(1);

  // 3. Persisted Color Lists
  const [recentColors, setRecentColors] = useLocalStorage<string[]>('colorpick_recent', []);
  const [favorites, setFavorites] = useLocalStorage<SavedColor[]>('colorpick_favorites', []);

  // 4. Color conversions memoized for performance
  const rgb = useMemo(() => hsvToRgb(hsv), [hsv]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const hex = useMemo(() => rgbToHex(rgb).toUpperCase(), [rgb]);
  const colorName = useMemo(() => getNearestColorName(hex), [hex]);
  const cmyk = useMemo(() => rgbToCmyk(rgb), [rgb]);

  // 5. Update URL state query parameter in real-time
  useEffect(() => {
    const cleanHex = hex.replace('#', '');
    const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?color=${cleanHex}`;
    window.history.replaceState({ path: newurl }, '', newurl);
  }, [hex]);

  // 6. Upward setters
  const setColorFromHsv = useCallback((newHsv: Partial<HSVColor>) => {
    setHsv((prev) => ({ ...prev, ...newHsv }));
  }, []);

  const setColorFromHex = useCallback((hexInput: string): boolean => {
    const cleanHex = hexInput.trim().replace(/^#/, '');
    if (!validateHex(cleanHex)) return false;
    
    const parsedRgb = hexToRgb(cleanHex);
    const parsedHsv = rgbToHsv(parsedRgb);
    setHsv(parsedHsv);

    // If hex includes opacity (8 chars)
    if (cleanHex.length === 8) {
      const alpha = parseInt(cleanHex.slice(6, 8), 16) / 255;
      setOpacity(parseFloat(alpha.toFixed(2)));
    }
    return true;
  }, []);

  const setColorFromRgb = useCallback((newRgb: Partial<RGBColor>) => {
    setHsv((prev) => {
      const currentRgb = hsvToRgb(prev);
      const updatedRgb = { ...currentRgb, ...newRgb } as RGBColor;
      return rgbToHsv(updatedRgb);
    });
  }, []);

  const setColorFromHsl = useCallback((newHsl: Partial<HSLColor>) => {
    setHsv((prev) => {
      const currentHsl = rgbToHsl(hsvToRgb(prev));
      const updatedHsl = { ...currentHsl, ...newHsl } as HSLColor;
      return rgbToHsv(hslToRgb(updatedHsl));
    });
  }, []);

  const setRandomColor = useCallback(() => {
    const randomHsv: HSVColor = {
      h: Math.floor(Math.random() * 360),
      s: Math.floor(Math.random() * 100),
      v: Math.floor(Math.random() * 40) + 60, // Keep value relatively high for beautiful UI colors
    };
    setHsv(randomHsv);
  }, []);

  // 7. Recent Colors (History Management)
  const addToHistory = useCallback((colorHex: string) => {
    const formatted = colorHex.toUpperCase();
    setRecentColors((prev) => {
      // Filter out if duplicate, add to front, limit to 20 swatches
      const filtered = prev.filter((c) => c !== formatted);
      return [formatted, ...filtered].slice(0, 20);
    });
  }, [setRecentColors]);

  const clearHistory = useCallback(() => {
    setRecentColors([]);
  }, [setRecentColors]);

  // 8. Saved Colors (Favorites Management)
  const addFavorite = useCallback((colorHex: string) => {
    const formatted = colorHex.toUpperCase();
    const name = getNearestColorName(formatted);
    
    setFavorites((prev) => {
      // Check if already in favorites to prevent duplicates
      if (prev.some((f) => f.hex === formatted)) return prev;

      const newFavorite: SavedColor = {
        id: crypto.randomUUID(),
        hex: formatted,
        name,
        timestamp: Date.now(),
      };
      return [newFavorite, ...prev];
    });
  }, [setFavorites]);

  const deleteFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, [setFavorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    hsv,
    rgb,
    hsl,
    hex,
    opacity,
    colorName,
    cmyk,
    setColorFromHsv,
    setColorFromHex,
    setColorFromRgb,
    setColorFromHsl,
    setOpacity,
    setRandomColor,
    recentColors,
    addToHistory,
    clearHistory,
    favorites,
    addFavorite,
    deleteFavorite,
    clearFavorites,
    setFavorites
  };
}
