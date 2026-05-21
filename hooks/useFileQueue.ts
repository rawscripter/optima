'use client';

import { useState, useCallback } from 'react';
import type { FileEntry, FileStatus } from '@/types';

function makeEntry(file: File): FileEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    objectURL: URL.createObjectURL(file),
    estimatedSize: null,
    status: 'pending',
    resultDataURL: null,
    resultSize: null,
    error: null,
  };
}

export function useFileQueue() {
  const [files, setFiles] = useState<FileEntry[]>([]);

  const addFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter((f) =>
      ['image/jpeg', 'image/png', 'image/gif', 'image/avif', 'image/webp'].includes(f.type)
    );
    setFiles((prev) => [...prev, ...valid.map(makeEntry)]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const entry = prev.find((f) => f.id === id);
      if (entry) URL.revokeObjectURL(entry.objectURL);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => URL.revokeObjectURL(f.objectURL));
      return [];
    });
  }, []);

  const updateEntry = useCallback(
    (id: string, patch: Partial<FileEntry>) => {
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    },
    []
  );

  const setStatus = useCallback(
    (id: string, status: FileStatus) => updateEntry(id, { status }),
    [updateEntry]
  );

  return { files, addFiles, removeFile, clearAll, updateEntry, setStatus };
}
