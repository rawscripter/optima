'use client';

import type { FileEntry } from '@/types';

interface Props {
  entry: FileEntry;
  index: number;
  onRemove: (id: string) => void;
  onPreview: (entry: FileEntry) => void;
  isDragOver: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  showCropButton?: boolean;
  hasCrop?: boolean;
  onCrop?: () => void;
}

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function savings(orig: number, out: number) {
  const pct = Math.round(((orig - out) / orig) * 100);
  return { pct, color: pct > 50 ? 'text-emerald-400' : pct > 20 ? 'text-yellow-400' : 'text-3' };
}

export function ImageQueueItem({ entry, index, onRemove, onPreview, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd, showCropButton, hasCrop, onCrop }: Props) {
  const isDone = entry.status === 'done';
  const isConverting = entry.status === 'converting';
  const isError = entry.status === 'error';

  return (
    <div
      draggable
      onDragStart={(e) => {
        // Only allow reorder drag from the handle (data-drag-handle)
        const target = e.target as HTMLElement;
        if (!target.closest('[data-drag-handle]')) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(index);
      }}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
      onDrop={(e) => { e.preventDefault(); onDrop(index); }}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 px-5 py-3 hover:bg-overlay transition-colors group relative
        ${isDragOver ? 'border-t-2 border-violet-400' : 'border-t border-transparent'}`}
    >
      {/* Drag handle */}
      <div
        data-drag-handle
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-4 hover:text-3 transition-colors p-0.5"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
        </svg>
      </div>

      {/* Thumbnail — draggable to desktop for done items */}
      <div
        className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-overlay ${isDone ? 'cursor-pointer' : ''}`}
        draggable={isDone}
        onDragStart={(e) => {
          e.stopPropagation();
          if (isDone && entry.resultDataURL) {
            const filename = entry.resultFilename ?? entry.file.name.replace(/\.[^.]+$/, '.webp');
            e.dataTransfer.setData('DownloadURL', `image/webp:${filename}:${entry.resultDataURL}`);
          }
        }}
        onClick={() => isDone && onPreview(entry)}
        title={isDone ? 'Drag to desktop to save · click to compare' : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={entry.objectURL} alt={entry.file.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-2 truncate leading-tight">
          {isDone && entry.resultFilename ? entry.resultFilename : entry.file.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-4">{fmt(entry.file.size)}</span>
          {isDone && entry.resultSize != null && (
            <>
              <span className="text-4 text-xs">→</span>
              <span className="text-xs text-3">{fmt(entry.resultSize)}</span>
              <span className={`text-xs font-semibold ${savings(entry.file.size, entry.resultSize).color}`}>
                -{savings(entry.file.size, entry.resultSize).pct}%
              </span>
            </>
          )}
          {!isDone && entry.estimatedSize && entry.status === 'pending' && (
            <span className="text-xs text-4">~{fmt(entry.estimatedSize)} est.</span>
          )}
          {isError && <span className="text-xs text-red-400 truncate">{entry.error}</span>}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {isConverting && <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />}
        {isDone && (
          <button onClick={() => onPreview(entry)}
            className="text-xs text-4 hover:text-violet-300 transition-colors px-2 py-1 rounded-lg hover:bg-violet-500/10">
            Compare
          </button>
        )}
        {isDone && entry.resultDataURL && (
          <a
            href={entry.resultDataURL}
            download={entry.resultFilename ?? entry.file.name.replace(/\.[^.]+$/, '.webp')}
            className="text-xs text-4 hover:text-2 transition-colors px-2 py-1 rounded-lg hover:bg-overlay"
          >
            Save
          </a>
        )}
        {showCropButton && (
          <button
            onClick={onCrop}
            title="Adjust crop"
            className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
              hasCrop
                ? 'border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20'
                : 'text-4 hover:text-2 border-transparent hover:border-base hover:bg-overlay'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onRemove(entry.id)}
          disabled={isConverting}
          className="p-1.5 rounded-lg text-4 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 disabled:pointer-events-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
