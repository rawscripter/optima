'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Preset } from '@/types';

const STORAGE_KEY = 'optima-saved-presets';

export function useSavedPresets() {
  const [savedPresets, setSavedPresets] = useState<Preset[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedPresets(JSON.parse(raw));
    } catch {
      // corrupted storage — ignore
    }
  }, []);

  const savePreset = useCallback((preset: Preset) => {
    setSavedPresets((prev) => {
      const next = [...prev.filter((p) => p.id !== preset.id), preset];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deletePreset = useCallback((id: string) => {
    setSavedPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { savedPresets, savePreset, deletePreset };
}
