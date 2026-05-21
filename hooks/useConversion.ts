'use client';

import { useCallback, useState } from 'react';
import type { FileEntry, Preset, CustomSettings } from '@/types';

export function useConversion(
  files: FileEntry[],
  updateEntry: (id: string, patch: Partial<FileEntry>) => void
) {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const convertAll = useCallback(
    async (preset: Preset, customSettings: CustomSettings) => {
      if (!files.length || isConverting) return;
      setIsConverting(true);
      setProgress(0);

      const pending = files.filter((f) => f.status !== 'done');
      let done = 0;

      await Promise.all(
        pending.map(async (entry) => {
          updateEntry(entry.id, { status: 'converting', error: null });

          const form = new FormData();
          form.append('file', entry.file);
          form.append('preset', preset.id);
          if (preset.id === 'custom') {
            form.append('customSettings', JSON.stringify(customSettings));
          }

          try {
            const res = await fetch('/api/convert', { method: 'POST', body: form });
            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error ?? 'Server error');
            }
            const data = await res.json();
            updateEntry(entry.id, {
              status: 'done',
              resultDataURL: data.dataURL,
              resultSize: data.outputSize,
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
    async (preset: Preset, customSettings: CustomSettings) => {
      const doneFiles = files.filter((f) => f.status === 'done');
      if (!doneFiles.length) return;

      const form = new FormData();
      doneFiles.forEach((f) => form.append('files', f.file));
      form.append('preset', preset.id);
      if (preset.id === 'custom') {
        form.append('customSettings', JSON.stringify(customSettings));
      }

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
