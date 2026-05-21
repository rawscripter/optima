'use client';

import type { CustomSettings } from '@/types';

interface Props {
  settings: CustomSettings;
  onChange: (s: CustomSettings) => void;
}

const FIT_OPTIONS: CustomSettings['fit'][] = ['inside', 'cover', 'contain', 'fill'];
const SHARP_PRESETS: CustomSettings['sharpPreset'][] = ['photo', 'picture', 'default', 'drawing', 'icon', 'text'];

export function CustomControls({ settings, onChange }: Props) {
  const set = <K extends keyof CustomSettings>(key: K, value: CustomSettings[K]) =>
    onChange({ ...settings, [key]: value });

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-5">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">Custom Settings</h3>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        {(['width', 'height'] as const).map((dim) => (
          <div key={dim} className="flex flex-col gap-1.5">
            <label className="text-xs text-white/50 capitalize">{dim} (px)</label>
            <input
              type="number"
              min={1}
              max={8000}
              placeholder="auto"
              value={settings[dim] ?? ''}
              onChange={(e) => set(dim, e.target.value ? Number(e.target.value) : null)}
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/20
                         focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Quality */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="text-xs text-white/50">Quality</label>
          <span className="text-xs font-mono text-violet-300">{settings.quality}</span>
        </div>
        <input
          type="range" min={1} max={100} step={1}
          value={settings.quality}
          onChange={(e) => set('quality', Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-white/20">
          <span>Smaller file</span><span>Better quality</span>
        </div>
      </div>

      {/* Effort */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="text-xs text-white/50">Compression Effort</label>
          <span className="text-xs font-mono text-violet-300">{settings.effort} / 6</span>
        </div>
        <input
          type="range" min={0} max={6} step={1}
          value={settings.effort}
          onChange={(e) => set('effort', Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-white/20">
          <span>Faster</span><span>Smaller file</span>
        </div>
      </div>

      {/* Fit mode */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-white/50">Fit Mode</label>
        <div className="flex gap-2 flex-wrap">
          {FIT_OPTIONS.map((fit) => (
            <button
              key={fit}
              onClick={() => set('fit', fit)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                settings.fit === fit
                  ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                  : 'border-white/10 bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              {fit}
            </button>
          ))}
        </div>
      </div>

      {/* Encoder preset */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-white/50">Encoder Preset</label>
        <div className="flex gap-2 flex-wrap">
          {SHARP_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => set('sharpPreset', p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                settings.sharpPreset === p
                  ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                  : 'border-white/10 bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-white/20">Use &quot;photo&quot; for product images</p>
      </div>

      {/* Toggles */}
      <div className="flex gap-5 flex-wrap">
        {([
          ['smartSubsample', 'Smart Subsample', 'Better color for photos'],
          ['nearLossless', 'Near-Lossless', 'Max quality, larger file'],
          ['lossless', 'Lossless', 'Perfect quality, biggest file'],
          ['animated', 'Animated GIF', 'Preserve animation frames'],
        ] as const).map(([key, label, hint]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer group">
            <div
              onClick={() => set(key, !settings[key])}
              className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
                settings[key] ? 'bg-violet-500' : 'bg-white/10'
              } relative`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                settings[key] ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </div>
            <div>
              <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors block">{label}</span>
              <span className="text-[10px] text-white/25">{hint}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
