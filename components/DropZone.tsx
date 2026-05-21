'use client';

import { useCallback, useRef, useState } from 'react';

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function DropZone({ onFiles, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      onFiles(Array.from(e.dataTransfer.files));
    },
    [onFiles, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) onFiles(Array.from(e.target.files));
      e.target.value = '';
    },
    [onFiles]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-4 rounded-2xl
        cursor-pointer select-none transition-all duration-200 px-8 py-16
        ${dragging
          ? 'border-2 border-violet-400 bg-violet-500/10 scale-[1.01] shadow-[0_0_40px_rgba(139,92,246,0.15)]'
          : 'border-2 border-dashed border-base hover:border-violet-500/30 bg-surface hover:bg-violet-500/[0.04]'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/avif,image/webp"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      <div className={`p-5 rounded-2xl transition-all ${dragging ? 'bg-violet-500/25 shadow-[0_0_30px_rgba(139,92,246,0.2)]' : 'bg-overlay'}`}>
        <svg
          className={`w-9 h-9 transition-colors ${dragging ? 'text-violet-300' : 'text-4'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      <div className="text-center space-y-1.5">
        <p className={`text-sm font-semibold transition-colors ${dragging ? 'text-violet-200' : 'text-2'}`}>
          {dragging ? 'Release to add images' : 'Drop images here'}
        </p>
        <p className="text-xs text-4">click to browse · or paste from clipboard (Ctrl+V)</p>
        <p className="text-xs text-4 opacity-60">JPG · PNG · GIF · AVIF · WebP</p>
      </div>
    </div>
  );
}
