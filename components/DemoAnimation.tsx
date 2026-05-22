'use client';

import { useEffect, useState } from 'react';

const FILES = [
  { name: 'hoodie-black.jpg', size: '2.4 MB', color: '#6366f1' },
  { name: 'sneaker-white.jpg', size: '3.1 MB', color: '#ec4899' },
  { name: 'bag-leather.jpg', size: '1.8 MB', color: '#f59e0b' },
];

const PRESETS = [
  { id: 'thumbnail', label: 'Thumbnail', dim: '150×150', kb: 18 },
  { id: 'gallery', label: 'Gallery', dim: '1000×1000', kb: 186 },
  { id: 'hero', label: 'Hero', dim: '1920×600', kb: 312 },
  { id: 'catalog', label: 'Catalog', dim: '600×600', kb: 94 },
];

type Phase = 'idle' | 'dropping' | 'converting' | 'done' | 'downloading';

export function DemoAnimation() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [droppedCount, setDroppedCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [donePresets, setDonePresets] = useState<number[]>([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    const run = () => {
      // Reset
      setPhase('idle');
      setDroppedCount(0);
      setProgress(0);
      setDonePresets([]);
      setDownloading(false);

      // Drop files one by one
      t = setTimeout(() => { setPhase('dropping'); setDroppedCount(1); }, 600);
      t = setTimeout(() => setDroppedCount(2), 1100);
      t = setTimeout(() => setDroppedCount(3), 1600);

      // Start converting
      t = setTimeout(() => { setPhase('converting'); setProgress(0); }, 2400);
      t = setTimeout(() => setProgress(25), 2800);
      t = setTimeout(() => setProgress(50), 3200);
      t = setTimeout(() => setProgress(75), 3600);
      t = setTimeout(() => setProgress(100), 4000);

      // Show results
      t = setTimeout(() => { setPhase('done'); setDonePresets([]); }, 4400);
      t = setTimeout(() => setDonePresets([0]), 4700);
      t = setTimeout(() => setDonePresets([0, 1]), 5000);
      t = setTimeout(() => setDonePresets([0, 1, 2]), 5300);
      t = setTimeout(() => setDonePresets([0, 1, 2, 3]), 5600);

      // Download
      t = setTimeout(() => setDownloading(true), 6400);
      t = setTimeout(() => setPhase('downloading'), 6600);

      // Loop
      t = setTimeout(run, 9000);
    };

    run();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-xl border border-base bg-elevated overflow-hidden select-none">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-base bg-base/50">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-3 text-xs text-4 font-mono">optima.appluto.com</span>
      </div>

      <div className="p-6 space-y-5">
        {/* Drop zone */}
        <div
          className="rounded-lg border-2 border-dashed transition-colors duration-300 p-4"
          style={{ borderColor: phase === 'dropping' || droppedCount > 0 ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)' }}
        >
          {droppedCount === 0 ? (
            <div className="flex flex-col items-center py-4 gap-2">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xs text-4">Drop product images here</p>
            </div>
          ) : (
            <div className="flex gap-3 flex-wrap">
              {FILES.slice(0, droppedCount).map((f, i) => (
                <div
                  key={f.name}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    animation: 'slideIn 0.3s ease',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-md shrink-0"
                    style={{ background: `linear-gradient(135deg, ${f.color}80, ${f.color}40)` }}
                  />
                  <div>
                    <div className="text-2 font-medium">{f.name}</div>
                    <div className="text-4">{f.size}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preset selector */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <div
              key={p.id}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
              style={{
                background: p.id === 'gallery' ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                border: p.id === 'gallery' ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: p.id === 'gallery' ? '#a78bfa' : 'var(--color-text-3, #888)',
              }}
            >
              {p.label} · {p.dim}
            </div>
          ))}
        </div>

        {/* Converting state */}
        {phase === 'converting' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-3">
              <span>Converting {FILES.length} images to WebP...</span>
              <span className="text-violet-400">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Done state — results */}
        {(phase === 'done' || phase === 'downloading') && (
          <div className="space-y-2">
            <p className="text-xs text-3 font-medium">3 images × 4 sizes = 12 files</p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    opacity: donePresets.includes(i) ? 1 : 0,
                    transform: donePresets.includes(i) ? 'translateY(0)' : 'translateY(6px)',
                  }}
                >
                  <span className="text-2">{p.label}</span>
                  <span className="text-emerald-400 font-medium">{p.kb} KB</span>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            {donePresets.length === 4 && (
              <div className="flex items-center gap-3 mt-1 px-3 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs text-emerald-400">Avg <strong>87% smaller</strong> than original JPG</span>
              </div>
            )}

            {/* Download button */}
            <button
              className="w-full mt-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: downloading ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.4)',
                color: '#a78bfa',
                transform: downloading ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloading ? 'Downloading woocommerce-images.zip...' : 'Download ZIP (12 files)'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
