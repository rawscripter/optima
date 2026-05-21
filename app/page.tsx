import { Converter } from '@/components/Converter';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="border-b border-white/[0.06] bg-[#0a0a0d]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.4)]">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Optima</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/20 text-violet-300 font-semibold">
              WebP
            </span>
          </div>
          <p className="text-xs text-white/25 hidden sm:block">WordPress product gallery optimizer</p>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Convert images to WebP
          </h1>
          <p className="text-sm text-white/40">
            Batch compress · WooCommerce presets · before/after preview · ZIP export
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <Converter />
      </div>
    </main>
  );
}
