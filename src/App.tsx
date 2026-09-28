import { useState, useEffect } from 'react';
import { useColor } from './hooks/useColor';
import { useClipboard } from './hooks/useClipboard';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import type { SavedColor } from './types/color';

// Component Imports
import { Header } from './components/Header';
import { HeroPicker } from './components/HeroPicker';
import { ColorPreviewCard } from './components/ColorPreviewCard';
import { ColorFormatsCard } from './components/ColorFormatsCard';
import { ContrastChecker } from './components/ContrastChecker';
import { PaletteGenerator } from './components/PaletteGenerator';
import { GradientGenerator } from './components/GradientGenerator';
import { ColorBlindnessSim } from './components/ColorBlindnessSim';
import { CssExport } from './components/CssExport';
import { ColorHistory } from './components/ColorHistory';
import { Favorites } from './components/Favorites';
import { Toast } from './components/Toast';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { Footer } from './components/Footer';

export default function App() {
  // 1. Color picking custom hook state
  const {
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
  } = useColor();

  // 2. Global Toast alert state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3. Shortcuts modal toggler
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // 4. Dark theme state & persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const persisted = window.localStorage.getItem('colorpick_theme');
      if (persisted) return JSON.parse(persisted);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode styling class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('colorpick_theme', JSON.stringify(darkMode));
    } catch (e) {
      console.warn(e);
    }
  }, [darkMode]);

  // 5. Clipboard helper with toast trigger callback
  const { copy } = useClipboard({
    onCopy: (text) => {
      setToastMessage(`Copied: "${text}" ✓`);
      addToHistory(hex);
    }
  });

  const handleCopyText = (text: string, label: string) => {
    copy(text);
    setToastMessage(`Copied ${label} to clipboard ✓`);
  };

  // 6. Favorites logic
  const handleSaveFavorite = () => {
    const isAlreadyFav = favorites.some((f) => f.hex === hex);
    if (isAlreadyFav) {
      // Find the existing favorite ID and delete it
      const existing = favorites.find((f) => f.hex === hex);
      if (existing) {
        deleteFavorite(existing.id);
        setToastMessage('Removed from favorites');
      }
    } else {
      addFavorite(hex);
      setToastMessage('Color saved to favorites ✓');
      addToHistory(hex);
    }
  };

  // Bulk save colors from generated palette harmony
  const handleSaveFavoritesGroup = (colors: string[]) => {
    let addedCount = 0;
    colors.forEach((color) => {
      if (!favorites.some((f) => f.hex === color)) {
        addFavorite(color);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setToastMessage(`Saved ${addedCount} colors to favorites ✓`);
    } else {
      setToastMessage('Colors already in favorites');
    }
  };

  // Import bulk array favorites from backup
  const handleImportFavorites = (importedFavs: SavedColor[]) => {
    setFavorites((prev) => {
      const merged = [...prev];
      importedFavs.forEach((item) => {
        if (!merged.some((m) => m.hex === item.hex)) {
          merged.push(item);
        }
      });
      return merged;
    });
  };

  // 7. Global Keyboard Shortcuts Handler integration
  useKeyboardShortcuts({
    onCopyHex: () => {
      const cleanHex = opacity < 1 
        ? `${hex}${Math.round(opacity * 255).toString(16).toUpperCase().padStart(2, '0')}`
        : hex;
      copy(cleanHex);
      setToastMessage(`Copied: "${cleanHex}" ✓`);
    },
    onRandomColor: () => {
      setRandomColor();
      setToastMessage('Generated random color');
    },
    onSaveColor: handleSaveFavorite,
    onToggleShortcuts: () => setIsShortcutsOpen((prev) => !prev),
  });

  const isFavorite = favorites.some((f) => f.hex === hex);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header element */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main layout container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Row 1: Interactive Picker & Detail Display Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Color Picker Canvas + Sliders (span 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <HeroPicker
              hsv={hsv}
              rgb={rgb}
              opacity={opacity}
              onHsvChange={setColorFromHsv}
              onOpacityChange={setOpacity}
              onRandomColor={setRandomColor}
              onHexChange={setColorFromHex}
            />
          </div>

          {/* Right Column: Preview block and Copy values cards (span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-8 h-full">
            <ColorPreviewCard
              hex={hex}
              rgb={rgb}
              hsl={hsl}
              opacity={opacity}
              colorName={colorName}
              onCopyText={handleCopyText}
              onSaveFavorite={handleSaveFavorite}
              isFavorite={isFavorite}
            />
          </div>
        </div>

        {/* Real-time editable Formats display inputs */}
        <ColorFormatsCard
          hex={hex}
          rgb={rgb}
          hsl={hsl}
          hsv={hsv}
          cmyk={cmyk}
          opacity={opacity}
          onHexChange={setColorFromHex}
          onRgbChange={setColorFromRgb}
          onHslChange={setColorFromHsl}
          onHsvChange={setColorFromHsv}
          onOpacityChange={setOpacity}
          onCopyText={handleCopyText}
        />

        {/* Contrast Auditor Accessibility section */}
        <ContrastChecker
          activeColorHex={hex}
          activeColorRgb={rgb}
        />

        {/* Palette Harmonies Harmony section */}
        <PaletteGenerator
          activeColorHex={hex}
          activeColorRgb={rgb}
          onSelectColor={setColorFromHex}
          onCopyText={handleCopyText}
          onSaveFavorites={handleSaveFavoritesGroup}
        />

        {/* Color Blindness Vision Simulator */}
        <ColorBlindnessSim
          activeColorHex={hex}
          onCopyText={handleCopyText}
        />

        {/* Gradient Generator builder tool */}
        <GradientGenerator
          activeColorHex={hex}
          onCopyText={handleCopyText}
        />

        {/* CSS Developer Snips */}
        <CssExport
          hex={hex}
          onCopyText={handleCopyText}
        />

        {/* History and Favorites Swatches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ColorHistory
            recentColors={recentColors}
            onSelectColor={setColorFromHex}
            onClearHistory={clearHistory}
          />
          <Favorites
            favorites={favorites}
            onSelectColor={setColorFromHex}
            onDeleteFavorite={deleteFavorite}
            onClearFavorites={clearFavorites}
            onCopyText={handleCopyText}
            onImportFavorites={handleImportFavorites}
          />
        </div>

      </main>

      {/* Footer element */}
      <Footer />

      {/* Popups, Dialogs and Toast warnings */}
      <Toast 
        message={toastMessage} 
        onClear={() => setToastMessage(null)} 
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* SVG Filters for vision deficiency rendering compatibility */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="achromatopsia-filter">
            <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>

    </div>
  );
}
