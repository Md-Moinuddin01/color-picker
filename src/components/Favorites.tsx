import React, { useRef } from 'react';
import { Copy, Trash2, Download, Upload, HeartOff } from 'lucide-react';
import type { SavedColor } from '../types/color';

interface FavoritesProps {
  favorites: SavedColor[];
  onSelectColor: (hex: string) => void;
  onDeleteFavorite: (id: string) => void;
  onClearFavorites: () => void;
  onCopyText: (text: string, label: string) => void;
  onImportFavorites: (favs: SavedColor[]) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  onSelectColor,
  onDeleteFavorite,
  onClearFavorites,
  onCopyText,
  onImportFavorites
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to Picker section
  const scrollToPicker = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Export Favorites to JSON file
  const exportFavoritesJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'colorpick_favorites.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Favorites from JSON file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    if (files && files.length > 0) {
      fileReader.readAsText(files[0], 'UTF-8');
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string) as SavedColor[];
          if (Array.isArray(parsed)) {
            // Basic validation
            const valid = parsed.every(
              (item) => typeof item.hex === 'string' && typeof item.name === 'string'
            );
            if (valid) {
              onImportFavorites(parsed);
              onCopyText('Imported favorites', 'Backup');
            } else {
              alert('JSON file does not contain valid ColorPick favorites data.');
            }
          }
        } catch (err) {
          console.error(err);
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  return (
    <section id="favorites-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-6 scroll-mt-20">
      
      {/* Header toolbar details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Colors</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your curated collection of favorite colors.
          </p>
        </div>

        {/* Toolbar */}
        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportFavoritesJson}
              className="flex items-center gap-1 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-slate-500 text-xs font-semibold transition-all focus:outline-none"
              title="Backup favorites to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-slate-500 text-xs font-semibold transition-all focus:outline-none"
              title="Restore favorites from JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".json"
            />

            <button
              onClick={onClearFavorites}
              className="flex items-center gap-1 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-950 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition-all focus:outline-none"
            >
              <HeartOff className="w-3.5 h-3.5" />
              <span>Remove All</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty state */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 select-none bg-slate-50/50 dark:bg-slate-950/20">
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1.5">No saved colors yet</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xs mb-5">
            Pick a color and save it to build your collection.
          </p>
          <button
            onClick={scrollToPicker}
            className="py-2 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm focus:outline-none"
          >
            Pick a Color
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map((fav) => (
            <div 
              key={fav.id}
              className="group flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 bg-slate-50 dark:bg-slate-950"
            >
              {/* Swatch */}
              <div 
                className="w-full h-24 cursor-pointer relative"
                style={{ backgroundColor: fav.hex }}
                onClick={() => onSelectColor(fav.hex)}
                title={`Pick ${fav.hex}`}
              />

              {/* Details and Actions */}
              <div className="p-3 flex flex-col gap-2.5">
                <div className="flex flex-col min-h-[36px]">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-white leading-tight">
                    {fav.hex}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-wider truncate">
                    {fav.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-850">
                  <button
                    onClick={() => onCopyText(fav.hex, 'Color HEX')}
                    className="flex-1 flex items-center justify-center p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200 text-slate-400 transition-colors"
                    title="Copy HEX"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteFavorite(fav.id)}
                    className="flex-1 flex items-center justify-center p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-950 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
