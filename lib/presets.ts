import type { Preset } from '@/types';

export const PRESET_IDS = new Set(['thumbnail', 'gallery', 'hero', 'catalog', 'custom']);

const BASE: Pick<Preset, 'effort' | 'lossless' | 'nearLossless' | 'smartSubsample' | 'sharpPreset' | 'animated' | 'targetSizeKB' | 'outputFormat' | 'preserveMetadata'> = {
  effort: 4, lossless: false, nearLossless: false, smartSubsample: true,
  sharpPreset: 'photo', animated: false, targetSizeKB: null,
  outputFormat: 'webp', preserveMetadata: false,
};

export const PRESETS: Preset[] = [
  { ...BASE, id: 'thumbnail', label: 'Product Thumbnail', description: 'Shop loop grid · 150×150 crop',      width: 150,  height: 150,  fit: 'cover',  quality: 95 },
  { ...BASE, id: 'gallery',   label: 'Product Gallery',   description: 'Single product images · 1000×1000', width: 1000, height: 1000, fit: 'cover',  quality: 95 },
  { ...BASE, id: 'hero',      label: 'Product Hero',      description: 'Featured / banner · 1600×900 crop',  width: 1600, height: 900,  fit: 'cover',  quality: 95, effort: 5 },
  { ...BASE, id: 'catalog',   label: 'Catalog Banner',    description: 'Category pages · 1200×400 crop',     width: 1200, height: 400,  fit: 'cover',  quality: 95 },
  { ...BASE, id: 'custom',    label: 'Custom',            description: 'Manual dimensions and quality',       width: null, height: null, fit: 'inside', quality: 95 },
];

export const WOO_PRESETS = PRESETS.filter((p) => p.id !== 'custom');

export function getPreset(id: string): Preset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[1];
}
