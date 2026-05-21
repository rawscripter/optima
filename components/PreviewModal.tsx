'use client';

import { useCallback, useRef, useState } from 'react';
import type { FileEntry } from '@/types';

interface Props {
  entry: FileEntry;
  onClose: () => void;
}

function fmt(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function PreviewModal({ entry, onClose }: Props) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSliderPos(x * 100);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
    setSliderPos(x * 100);
  }, []);

  const pct = entry.resultSize
    ? Math.round(((entry.file.size - entry.resultSize) / entry.file.size) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-[#0f0f13] border border-white/10 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <p className="text-sm font-semibold text-white/80">{entry.file.name}</p>
            <p className="text-xs text-white/40 mt-0.5">Drag the slider to compare</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comparison slider */}
        <div
          ref={containerRef}
          className="relative select-none overflow-hidden cursor-col-resize"
          style={{ aspectRatio: '16/9' }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* After (WebP) — full width base */}
          {entry.resultDataURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.resultDataURL}
              alt="After"
              className="absolute inset-0 w-full h-full object-contain bg-[#0a0a0d]"
            />
          )}

          {/* Before (original) — clipped */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.objectURL}
              alt="Before"
              className="absolute inset-0 w-full h-full object-contain bg-[#0a0a0d]"
            />
          </div>

          {/* Divider */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 text-xs text-white/70 backdrop-blur-sm">
            Before · {fmt(entry.file.size)}
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 text-xs text-emerald-300 backdrop-blur-sm">
            WebP · {entry.resultSize ? fmt(entry.resultSize) : '—'} · -{pct}%
          </div>
        </div>

        {/* Footer stats */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center gap-6 text-xs text-white/40">
          <span>Original: <strong className="text-white/60">{fmt(entry.file.size)}</strong></span>
          <span>WebP: <strong className="text-white/60">{entry.resultSize ? fmt(entry.resultSize) : '—'}</strong></span>
          <span>Saved: <strong className="text-emerald-400">-{pct}%</strong></span>
        </div>
      </div>
    </div>
  );
}
