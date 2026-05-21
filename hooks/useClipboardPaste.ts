'use client';

import { useEffect } from 'react';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/avif', 'image/webp']);

export function useClipboardPaste(onFiles: (files: File[]) => void) {
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const files = items
        .filter((item) => IMAGE_TYPES.has(item.type))
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      if (files.length) {
        e.preventDefault();
        onFiles(files);
      }
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, [onFiles]);
}
