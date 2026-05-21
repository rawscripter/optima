'use client';

import { useCallback, useState } from 'react';
import { applyRename, type RenameSettings } from '@/lib/rename';
import { PRESET_IDS } from '@/lib/presets';
import type { FileEntry, Preset, CustomSettings } from '@/types';

export function useConversion(
  files: FileEntry[],
  updateEntry: (id: string, patch: Partial<FileEntry>) => void
) {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const convertAll = useCallback(
    async (preset: Preset, customSettings: CustomSettings, renameSettings: RenameSettings) => {
      if (!files.length || isConverting) return;
      setIsConverting(true);
      setProgress(0);

      const pending = files.filter((f) => f.status !== 'done');
      let done = 0;

      await Promise.all(
        pending.map(async (entry, i) => {
          updateEntry(entry.id, { status: 'converting', error: null });

          const form = new FormData();
          form.append('file', entry.file);
          form.append('preset', preset.id);
          if (!PRESET_IDS.has(preset.id) || preset.id === 'custom') {
            form.append('customSettings', JSON.stringify(customSettings));
          }
          if (entry.cropCx != null) form.append('cropCx', String(entry.cropCx));
          if (entry.cropCy != null) form.append('cropCy', String(entry.cropCy));

          try {
            const res = await fetch('/api/convert', { method: 'POST', body: form });
            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error ?? 'Server error');
            }
            const data = await res.json();
            const globalIndex = files.findIndex((f) => f.id === entry.id);
            const ext = data.format ?? 'webp';
            const baseRename = applyRename(entry.file.name, renameSettings, globalIndex >= 0 ? globalIndex : i);
            const resultFilename = baseRename.replace(/\.[^.]+$/, `.${ext}`);
            updateEntry(entry.id, {
              status: 'done',
              resultDataURL: data.dataURL,
              resultSize: data.outputSize,
              resultFilename,
            });
          } catch (err) {
            updateEntry(entry.id, {
              status: 'error',
              error: err instanceof Error ? err.message : 'Unknown error',
            });
          } finally {
            done++;
            setProgress(Math.round((done / pending.length) * 100));
          }
        })
      );

      setIsConverting(false);
    },
    [files, isConverting, updateEntry]
  );

  const downloadZip = useCallback(
    async (preset: Preset, customSettings: CustomSettings, renameSettings: RenameSettings) => {
      const doneFiles = files.filter((f) => f.status === 'done');
      if (!doneFiles.length) return;

      const form = new FormData();
      doneFiles.forEach((f) => form.append('files', f.file));
      form.append('preset', preset.id);
      if (!PRESET_IDS.has(preset.id) || preset.id === 'custom') {
        form.append('customSettings', JSON.stringify(customSettings));
      }

      const renames = doneFiles.map((f) => f.resultFilename ?? f.file.name.replace(/\.[^.]+$/, '.webp'));
      form.append('renames', JSON.stringify(renames));

      const res = await fetch('/api/batch', { method: 'POST', body: form });
      if (!res.ok) return;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optima-export.zip';
      a.click();
      URL.revokeObjectURL(url);
    },
    [files]
  );

  return { isConverting, progress, convertAll, downloadZip };
}
