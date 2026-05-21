'use client';

import { type RenameSettings } from '@/lib/rename';

interface Props {
  settings: RenameSettings;
  onChange: (s: RenameSettings) => void;
  exampleName?: string;
}

export function RenamePanel({ settings, onChange, exampleName = 'My Product Image.jpg' }: Props) {
  const set = <K extends keyof RenameSettings>(k: K, v: RenameSettings[K]) =>
    onChange({ ...settings, [k]: v });

  const preview = (() => {
    let name = exampleName.replace(/\.[^.]+$/, '');
    if (!settings.enabled) return `${name}.webp`;
    if (settings.stripSpaces) name = name.replace(/[\s_]+/g, '-');
    if (settings.lowercase) name = name.toLowerCase();
    name = name.replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (settings.prefix) name = `${settings.prefix}${name}`;
    if (settings.addIndex) name = `${name}-0${settings.indexStart}`;
    return `${name}.webp`;
  })();

  return (
    <div className="rounded-2xl border border-base bg-surface p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-4">Rename on Export</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => set('enabled', !settings.enabled)}
            className={`w-9 h-5 rounded-full transition-colors relative ${settings.enabled ? 'bg-violet-500' : 'bg-overlay border border-base'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
        </label>
      </div>

      {settings.enabled && (
        <>
          {/* Prefix */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-3">Prefix</label>
            <input
              type="text"
              placeholder="e.g. product-"
              value={settings.prefix}
              onChange={(e) => set('prefix', e.target.value)}
              className="rounded-lg bg-overlay border border-base px-3 py-2 text-sm text-1 placeholder-[color:var(--text-4)]
                         focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-colors"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {([
              ['stripSpaces', 'Strip spaces → hyphens'],
              ['lowercase', 'Lowercase'],
              ['addIndex', 'Add index (-01, -02…)'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer group col-span-1">
                <div
                  onClick={() => set(key, !settings[key])}
                  className={`w-8 h-4.5 rounded-full transition-colors flex-shrink-0 relative ${settings[key] ? 'bg-violet-500' : 'bg-overlay border border-base'}`}
                  style={{ height: '18px', width: '32px' }}
                >
                  <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${settings[key] ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-3 group-hover:text-2 transition-colors">{label}</span>
              </label>
            ))}

            {settings.addIndex && (
              <div className="flex items-center gap-2 col-span-1">
                <label className="text-xs text-3 whitespace-nowrap">Start at</label>
                <input
                  type="number" min={0} max={999}
                  value={settings.indexStart}
                  onChange={(e) => set('indexStart', Number(e.target.value))}
                  className="w-16 rounded-lg bg-overlay border border-base px-2 py-1 text-sm text-1
                             focus:outline-none focus:border-violet-500/60 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-overlay border border-base px-3 py-2">
            <p className="text-[10px] text-4 mb-1">Preview</p>
            <p className="text-xs font-mono text-violet-300 truncate">{preview}</p>
          </div>
        </>
      )}
    </div>
  );
}
