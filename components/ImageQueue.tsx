'use client';

import { ImageQueueItem } from './ImageQueueItem';
import type { FileEntry } from '@/types';

interface Props {
  files: FileEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onPreview: (entry: FileEntry) => void;
}

export function ImageQueue({ files, onRemove, onClear, onPreview }: Props) {
  if (!files.length) return null;

  const done = files.filter((f) => f.status === 'done').length;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30">Queue</h2>
          <span className="text-xs text-white/20">{files.length} image{files.length !== 1 ? 's' : ''}</span>
          {done > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {done} done
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          className="text-xs text-white/20 hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col divide-y divide-white/[0.04] max-h-80 overflow-y-auto scrollbar-thin">
        {files.map((entry) => (
          <ImageQueueItem
            key={entry.id}
            entry={entry}
            onRemove={onRemove}
            onPreview={onPreview}
          />
        ))}
      </div>
    </div>
  );
}
