export interface Preset {
  id: string;
  label: string;
  description: string;
  width: number | null;
  height: number | null;
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality: number;
  effort: number;
  lossless: boolean;
  nearLossless: boolean;
  smartSubsample: boolean;
  sharpPreset: 'default' | 'photo' | 'picture' | 'drawing' | 'icon' | 'text';
  animated: boolean;
}

export interface CustomSettings {
  width: number | null;
  height: number | null;
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality: number;
  effort: number;
  lossless: boolean;
  nearLossless: boolean;
  smartSubsample: boolean;
  sharpPreset: 'default' | 'photo' | 'picture' | 'drawing' | 'icon' | 'text';
  animated: boolean;
}

export type FileStatus = 'pending' | 'converting' | 'done' | 'error';

export interface FileEntry {
  id: string;
  file: File;
  objectURL: string;
  estimatedSize: number | null;
  status: FileStatus;
  resultDataURL: string | null;
  resultSize: number | null;
  error: string | null;
}

export interface ConversionResult {
  filename: string;
  dataURL: string;
  originalSize: number;
  outputSize: number;
  width: number;
  height: number;
}
