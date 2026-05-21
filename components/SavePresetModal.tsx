'use client';

import { useState, useRef, useEffect } from 'react';
import type { Preset, CustomSettings } from '@/types';

interface Props { settings: CustomSettings; onSave: (preset: Preset) => void; onClose: () => void; }

export function SavePresetModal({ settings, onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      ...settings,
      id: `custom-${Date.now()}`,
      label: trimmed,
      description: [
        settings.width && settings.height ? `${settings.width}×${settings.height}` : 'original',
        `q${settings.quality}`,
      ].join(' · '),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-elevated border border-base rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-1">Save Preset</h3>
          <p className="text-xs text-4 mt-1">
            {settings.width && settings.height ? `${settings.width}×${settings.height} · ` : 'Original size · '}
            q{settings.quality} · {settings.sharpPreset}
          </p>
        </div>
        <input
          ref={inputRef}
          type="text" placeholder="Preset name…" value={name} maxLength={40}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
          className="rounded-lg bg-overlay border border-base px-3 py-2.5 text-sm text-1 placeholder-[color:var(--text-4)]
                     focus:outline-none focus:border-violet-500/60 transition-colors"
        />
        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm text-3 border border-base hover:border-base hover:text-2 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-violet-600 text-white
                       hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
