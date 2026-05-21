'use client';

import { useState } from 'react';
import { applyRename, type RenameSettings } from '@/lib/rename';
import type { FileEntry } from '@/types';

interface Props {
  files: FileEntry[];
  renameSettings: RenameSettings;
}

export function WooPackButton({ files, renameSettings }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!files.length || loading) return;
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      files.forEach((f) => form.append('files', f.file));
      const renames = files.map((f, i) => applyRename(f.file.name, renameSettings, i));
      form.append('renames', JSON.stringify(renames));
      const crops = files.map((f) => f.cropCx != null && f.cropCy != null ? { cx: f.cropCx, cy: f.cropCy } : null);
      if (crops.some(Boolean)) form.append('crops', JSON.stringify(crops));

      const res = await fetch('/api/woo-all', { method: 'POST', body: form });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Server error ${res.status}: ${body}`);
      }

      const blob = await res.blob();
      if (blob.size === 0) throw new Error('Empty response from server');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'woocommerce-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[woo-all]', err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!files.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border
          flex items-center justify-center gap-2
          ${loading
            ? 'bg-overlay border-base text-4 cursor-not-allowed'
            : 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20 hover:border-teal-400/50'
          }
        `}
      >
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-teal-400/40 border-t-teal-300 animate-spin" />
            Generating all sizes…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Generate All WooCommerce Sizes
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500/15 border border-teal-500/20 font-normal">
              thumbnail · gallery · hero · catalog
            </span>
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-400 px-1">{error}</p>
      )}
    </div>
  );
}
