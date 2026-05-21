'use client';

import type { FileEntry } from '@/types';

interface Props {
  entry: FileEntry;
  onRemove: (id: string) => void;
  onPreview: (entry: FileEntry) => void;
}

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function savings(orig: number, out: number) {
  const pct = Math.round(((orig - out) / orig) * 100);
  return { pct, color: pct > 50 ? 'text-emerald-400' : pct > 20 ? 'text-yellow-400' : 'text-white/40' };
}

export function ImageQueueItem({ entry, onRemove, onPreview }: Props) {
  const isDone = entry.status === 'done';
  const isConverting = entry.status === 'converting';
  const isError = entry.status === 'error';

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors group">
      {/* Thumbnail */}
      <div
        className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 ${isDone ? 'cursor-pointer' : ''}`}
        onClick={() => isDone && onPreview(entry)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={entry.objectURL} alt={entry.file.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/70 truncate leading-tight">{entry.file.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-white/25">{fmt(entry.file.size)}</span>
          {isDone && entry.resultSize != null && (
            <>
              <span className="text-white/15 text-xs">→</span>
              <span className="text-xs text-white/40">{fmt(entry.resultSize)}</span>
              <span className={`text-xs font-semibold ${savings(entry.file.size, entry.resultSize).color}`}>
                -{savings(entry.file.size, entry.resultSize).pct}%
              </span>
            </>
          )}
          {!isDone && entry.estimatedSize && entry.status === 'pending' && (
            <span className="text-xs text-white/20">~{fmt(entry.estimatedSize)} est.</span>
          )}
          {isError && (
            <span className="text-xs text-red-400 truncate">{entry.error}</span>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {isConverting && (
          <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        )}
        {isDone && (
          <button
            onClick={() => onPreview(entry)}
            className="text-xs text-white/25 hover:text-violet-300 transition-colors px-2 py-1 rounded-lg hover:bg-violet-500/10"
          >
            Compare
          </button>
        )}
        {isDone && entry.resultDataURL && (
          <a
            href={entry.resultDataURL}
            download={entry.file.name.replace(/\.[^.]+$/, '.webp')}
            className="text-xs text-white/20 hover:text-white/50 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
          >
            Save
          </a>
        )}
        <button
          onClick={() => onRemove(entry.id)}
          disabled={isConverting}
          className="p-1.5 rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 disabled:pointer-events-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
