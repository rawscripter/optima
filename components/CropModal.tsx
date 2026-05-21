'use client';

import { useCallback, useRef, useState } from 'react';

interface Props {
  src: string;
  targetWidth: number;
  targetHeight: number;
  initialCx: number;
  initialCy: number;
  onConfirm: (cx: number, cy: number) => void;
  onClose: () => void;
}

export function CropModal({ src, targetWidth, targetHeight, initialCx, initialCy, onConfirm, onClose }: Props) {
  const [imgNat, setImgNat] = useState<{ w: number; h: number } | null>(null);
  const [cropCenter, setCropCenter] = useState({ x: initialCx, y: initialCy });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Compute display dimensions: fit image within maxW x maxH
  const maxW = 700, maxH = 480;
  const scale = imgNat ? Math.min(maxW / imgNat.w, maxH / imgNat.h) : 1;
  const displayW = imgNat ? Math.round(imgNat.w * scale) : maxW;
  const displayH = imgNat ? Math.round(imgNat.h * scale) : maxH;

  // Crop box in display coordinates
  const targetRatio = targetWidth / targetHeight;
  const displayRatio = displayW / displayH;
  const boxW = targetRatio <= displayRatio ? Math.round(displayH * targetRatio) : displayW;
  const boxH = targetRatio <= displayRatio ? displayH : Math.round(displayW / targetRatio);

  const rawLeft = cropCenter.x * displayW - boxW / 2;
  const rawTop = cropCenter.y * displayH - boxH / 2;
  const boxLeft = Math.max(0, Math.min(displayW - boxW, rawLeft));
  const boxTop = Math.max(0, Math.min(displayH - boxH, rawTop));

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(displayW, e.clientX - rect.left));
    const y = Math.max(0, Math.min(displayH, e.clientY - rect.top));
    setCropCenter({ x: x / displayW, y: y / displayH });
  }, [displayW, displayH]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(displayW, e.clientX - rect.left));
    const y = Math.max(0, Math.min(displayH, e.clientY - rect.top));
    setCropCenter({ x: x / displayW, y: y / displayH });
  }, [displayW, displayH]);

  const handlePointerUp = useCallback(() => { dragging.current = false; }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface rounded-2xl border border-base flex flex-col gap-4 p-5 max-w-3xl w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-1">Adjust Crop</h2>
            <p className="text-xs text-4">
              Click or drag to choose the crop center · {targetWidth}×{targetHeight}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-3 hover:text-1 hover:bg-overlay transition-colors text-lg"
          >×</button>
        </div>

        {/* Image container */}
        <div className="flex justify-center">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-xl bg-black cursor-crosshair select-none"
            style={{ width: `${displayW}px`, height: `${displayH}px` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-fill"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                setImgNat({ w: img.naturalWidth, h: img.naturalHeight });
              }}
            />

            {/* Dark overlay masks — outside crop box */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bg-black/60" style={{ top: 0, left: 0, right: 0, height: `${boxTop}px` }} />
              <div className="absolute bg-black/60" style={{ top: `${boxTop + boxH}px`, left: 0, right: 0, bottom: 0 }} />
              <div className="absolute bg-black/60" style={{ top: `${boxTop}px`, left: 0, width: `${boxLeft}px`, height: `${boxH}px` }} />
              <div className="absolute bg-black/60" style={{ top: `${boxTop}px`, left: `${boxLeft + boxW}px`, right: 0, height: `${boxH}px` }} />

              {/* Crop border */}
              <div
                className="absolute border-2 border-white/90"
                style={{ top: `${boxTop}px`, left: `${boxLeft}px`, width: `${boxW}px`, height: `${boxH}px` }}
              >
                {/* Rule-of-thirds lines */}
                <div className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: `${boxW / 3}px 100%, 100% ${boxH / 3}px`,
                  }}
                />
                {/* Center dot */}
                <div className="absolute w-2 h-2 rounded-full bg-white/80 border border-white/40"
                  style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm border border-base text-3 hover:text-1 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(cropCenter.x, cropCenter.y); onClose(); }}
            className="px-4 py-2 rounded-xl text-sm bg-violet-500/20 border border-violet-500/40 text-violet-300 hover:bg-violet-500/30 transition-colors"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
