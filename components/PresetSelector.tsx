'use client';

import { PRESETS } from '@/lib/presets';
import type { Preset } from '@/types';

interface Props {
  selected: Preset;
  onChange: (preset: Preset) => void;
  savedPresets: Preset[];
  onDeleteSaved: (id: string) => void;
  onSaveRequest: () => void;
}

const ICONS: Record<string, React.ReactNode> = {
  thumbnail: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  gallery: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  hero: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>,
  catalog: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  custom: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
};

function PresetCard({ preset, active, onClick, onDelete }: {
  preset: Preset; active: boolean; onClick: () => void; onDelete?: () => void;
}) {
  const dim = preset.width ? `${preset.width}×${preset.height}` : 'original';
  return (
    <div className="relative group/card">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-150 border
          ${active
            ? 'border-violet-500/60 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_4px_20px_rgba(139,92,246,0.08)]'
            : 'border-base bg-surface hover:border-violet-500/20 hover:bg-overlay'
          }`}
      >
        <div className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${active ? 'bg-violet-500/20 text-violet-300' : 'bg-overlay text-4'}`}>
          {ICONS[preset.id] ?? ICONS.custom}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold truncate ${active ? 'text-1' : 'text-2'}`}>{preset.label}</p>
          <p className={`text-xs ${active ? 'text-violet-300/70' : 'text-4'}`}>{dim}</p>
        </div>
        {active && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />}
      </button>

      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-elevated border border-base
                     text-4 hover:text-red-400 hover:border-red-500/30 transition-all
                     hidden group-hover/card:flex items-center justify-center z-10"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function PresetSelector({ selected, onChange, savedPresets, onDeleteSaved, onSaveRequest }: Props) {
  return (
    <div className="rounded-2xl border border-base bg-surface p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-4">Presets</h2>
          <button
            onClick={onSaveRequest}
            className="flex items-center gap-1 text-[11px] text-4 hover:text-violet-300 transition-colors group"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Save current
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESETS.map((p) => <PresetCard key={p.id} preset={p} active={selected.id === p.id} onClick={() => onChange(p)} />)}
        </div>
      </div>

      {savedPresets.length > 0 && (
        <div className="flex flex-col gap-3 pt-4 border-t border-base">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-4">Saved</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {savedPresets.map((p) => (
              <PresetCard key={p.id} preset={p} active={selected.id === p.id} onClick={() => onChange(p)} onDelete={() => onDeleteSaved(p.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
