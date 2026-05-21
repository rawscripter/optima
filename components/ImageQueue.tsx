'use client';

import { useState } from 'react';
import { ImageQueueItem } from './ImageQueueItem';
import type { FileEntry } from '@/types';

interface Props {
  files: FileEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onPreview: (entry: FileEntry) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  showCropButton?: boolean;
  onCrop?: (id: string) => void;
}

export function ImageQueue({ files, onRemove, onClear, onPreview, onReorder, showCropButton, onCrop }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDrop = (toIndex: number) => {
    if (dragIndex !== null && dragIndex !== toIndex) {
      onReorder(dragIndex, toIndex);
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  if (!files.length) return null;

  const done = files.filter((f) => f.status === 'done').length;

  return (
    <div className="rounded-2xl border border-base bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-base">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-4">Queue</h2>
          <span className="text-xs text-4">{files.length} image{files.length !== 1 ? 's' : ''}</span>
          {done > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {done} done
            </span>
          )}
        </div>
        <button onClick={onClear} className="text-xs text-4 hover:text-red-400 transition-colors">
          Clear all
        </button>
      </div>

      <div className="flex flex-col max-h-80 overflow-y-auto scrollbar-thin divide-y divide-[color:var(--border)]">
        {files.map((entry, i) => (
          <ImageQueueItem
            key={entry.id}
            entry={entry}
            index={i}
            onRemove={onRemove}
            onPreview={onPreview}
            isDragOver={dropIndex === i && dragIndex !== i}
            onDragStart={setDragIndex}
            onDragOver={setDropIndex}
            onDrop={handleDrop}
            onDragEnd={() => { setDragIndex(null); setDropIndex(null); }}
            showCropButton={showCropButton}
            hasCrop={entry.cropCx != null}
            onCrop={() => onCrop?.(entry.id)}
          />
        ))}
      </div>
    </div>
  );
}
