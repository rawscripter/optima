export interface RenameSettings {
  enabled: boolean;
  prefix: string;
  stripSpaces: boolean;
  lowercase: boolean;
  addIndex: boolean;
  indexStart: number;
}

export const DEFAULT_RENAME: RenameSettings = {
  enabled: false,
  prefix: '',
  stripSpaces: true,
  lowercase: true,
  addIndex: false,
  indexStart: 1,
};

export function applyRename(
  originalName: string,
  settings: RenameSettings,
  index: number
): string {
  let name = originalName.replace(/\.[^.]+$/, '');

  if (!settings.enabled) return `${name}.webp`;

  if (settings.stripSpaces) name = name.replace(/[\s_]+/g, '-');
  if (settings.lowercase) name = name.toLowerCase();
  name = name.replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (settings.prefix) name = `${settings.prefix}${name}`;
  if (settings.addIndex) {
    const n = String(index + settings.indexStart).padStart(2, '0');
    name = `${name}-${n}`;
  }

  return `${name}.webp`;
}
