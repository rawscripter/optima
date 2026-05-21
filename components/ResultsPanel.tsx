'use client';

import type { FileEntry, Preset, CustomSettings } from '@/types';

interface Props {
  files: FileEntry[];
  onDownloadZip: () => void;
  preset: Preset;
  customSettings: CustomSettings;
}

function fmt(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ResultsPanel({ files, onDownloadZip }: Props) {
  const done = files.filter((f) => f.status === 'done');
  if (!done.length) return null;

  const totalOrig = done.reduce((s, f) => s + f.file.size, 0);
  const totalOut = done.reduce((s, f) => s + (f.resultSize ?? f.file.size), 0);
  const totalSaved = Math.round(((totalOrig - totalOut) / totalOrig) * 100);

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 flex flex-col gap-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white/80">
            {done.length} image{done.length !== 1 ? 's' : ''} converted
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {fmt(totalOrig)} → {fmt(totalOut)}
            <span className="text-emerald-400 font-semibold ml-2">-{totalSaved}% saved</span>
          </p>
        </div>
        {done.length > 1 && (
          <button
            onClick={onDownloadZip}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30
                       text-emerald-300 text-sm font-medium hover:bg-emerald-500/25 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download ZIP
          </button>
        )}
      </div>

      {/* Per-file breakdown */}
      <div className="rounded-lg overflow-hidden border border-white/5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="text-left px-3 py-2 text-white/30 font-medium">File</th>
              <th className="text-right px-3 py-2 text-white/30 font-medium">Original</th>
              <th className="text-right px-3 py-2 text-white/30 font-medium">WebP</th>
              <th className="text-right px-3 py-2 text-white/30 font-medium">Saved</th>
            </tr>
          </thead>
          <tbody>
            {done.map((f) => {
              const out = f.resultSize ?? f.file.size;
              const pct = Math.round(((f.file.size - out) / f.file.size) * 100);
              return (
                <tr key={f.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-3 py-2 text-white/60 truncate max-w-[200px]">{f.file.name}</td>
                  <td className="px-3 py-2 text-right text-white/40">{fmt(f.file.size)}</td>
                  <td className="px-3 py-2 text-right text-white/60">{fmt(out)}</td>
                  <td className={`px-3 py-2 text-right font-semibold ${
                    pct > 50 ? 'text-emerald-400' : pct > 20 ? 'text-yellow-400' : 'text-white/30'
                  }`}>
                    -{pct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
