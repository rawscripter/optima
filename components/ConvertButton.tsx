'use client';

interface Props {
  onClick: () => void;
  isConverting: boolean;
  progress: number;
  disabled: boolean;
  hasDone: boolean;
}

export function ConvertButton({ onClick, isConverting, progress, disabled, hasDone }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isConverting}
      className={`
        relative w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 overflow-hidden
        ${disabled || isConverting
          ? 'bg-overlay text-4 cursor-not-allowed border border-base'
          : 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-[0_4px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_32px_rgba(139,92,246,0.4)] hover:from-violet-500 hover:to-violet-400 active:scale-[0.99]'
        }
      `}
    >
      {isConverting && (
        <div className="absolute inset-0 bg-violet-300/10 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {isConverting ? (
          <>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Converting… {progress}%
          </>
        ) : hasDone ? 'Re-convert' : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Convert to WebP
          </>
        )}
      </span>
    </button>
  );
}
