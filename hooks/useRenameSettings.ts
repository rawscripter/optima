'use client';

import { useState } from 'react';
import { DEFAULT_RENAME, type RenameSettings } from '@/lib/rename';

export function useRenameSettings() {
  const [renameSettings, setRenameSettings] = useState<RenameSettings>(DEFAULT_RENAME);
  return { renameSettings, setRenameSettings };
}
