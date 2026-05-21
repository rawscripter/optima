'use client';

import { useEffect } from 'react';
import { estimateWebpSize } from '@/lib/client-preview';
import type { FileEntry } from '@/types';

export function useClientPreview(
  files: FileEntry[],
  quality: number,
  updateEntry: (id: string, patch: Partial<FileEntry>) => void
) {
  useEffect(() => {
    const pending = files.filter((f) => f.estimatedSize === null && f.status === 'pending');
    for (const entry of pending) {
      estimateWebpSize(entry.file, quality).then((size) => {
        if (size !== null) updateEntry(entry.id, { estimatedSize: size });
      });
    }
  }, [files, quality, updateEntry]);
}
