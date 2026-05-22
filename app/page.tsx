'use client';

import { Converter } from '@/components/Converter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DemoAnimation } from '@/components/DemoAnimation';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  const { theme, toggle } = useTheme();

  return (
    <main className="min-h-screen">
      <header className="border-b border-base bg-elevated/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.4)]">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-1">Optima</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/20 text-violet-300 font-semibold">
              WebP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-4 hidden sm:block">WordPress product gallery optimizer</p>
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-1 mb-1">Convert images to WebP</h1>
          <p className="text-sm text-3">Batch compress · WooCommerce presets · before/after preview · ZIP export</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <Converter />
      </div>

      {/* Demo + Features + FAQ — SEO content */}
      <div className="max-w-4xl mx-auto px-6 mt-20 pb-20 space-y-16">

        {/* Animated demo */}
        <section>
          <h2 className="text-xl font-bold text-1 mb-3">See it in action</h2>
          <DemoAnimation />
        </section>

        {/* Features */}
        <section>
          <h2 className="text-xl font-bold text-1 mb-6">How to optimize WooCommerce product images</h2>
          <ol className="space-y-4 text-sm text-2">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
              <div><strong className="text-1">Upload your product images</strong> — drag and drop JPG, PNG, or WebP files. Batch upload up to 20 images at once.</div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
              <div><strong className="text-1">Choose a WooCommerce preset</strong> — thumbnail (150×150), gallery (1000×1000), hero (1920×600), or catalog (600×600). Or set custom dimensions.</div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
              <div><strong className="text-1">Crop and adjust</strong> — use the visual crop tool to pick exactly which part of the image to keep for each product.</div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
              <div><strong className="text-1">Download optimized WebP files</strong> — get all 4 WooCommerce sizes in a single ZIP, ready to upload to your WordPress store.</div>
            </li>
          </ol>
        </section>

        {/* Feature grid */}
        <section>
          <h2 className="text-xl font-bold text-1 mb-6">Why use WebP for WooCommerce product images?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Smaller file sizes', body: 'WebP images are 25-35% smaller than JPEG at the same quality. Faster page loads = better Google rankings.' },
              { title: 'WooCommerce-ready sizes', body: 'Auto-generates all required sizes: thumbnail, gallery, hero, and catalog — no manual resizing in Photoshop.' },
              { title: 'Visual crop tool', body: 'Choose which part of each image to keep. Perfect for product shots where the subject isn\'t centered.' },
              { title: 'Free, no account needed', body: 'No signup, no watermarks, no limits on downloads. Your images never leave your browser.' },
            ].map(({ title, body }) => (
              <div key={title} className="p-4 rounded-lg border border-base bg-elevated">
                <h3 className="font-semibold text-sm text-1 mb-1">{title}</h3>
                <p className="text-xs text-3 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-1 mb-6">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              {
                q: 'What size should WooCommerce product images be?',
                a: 'WooCommerce recommends 800×800px minimum for product images. Optima generates the standard sizes: thumbnail (150×150), catalog (600×600), gallery (1000×1000), and hero (1920×600) — all in one click.',
              },
              {
                q: 'Should I use WebP for WooCommerce?',
                a: 'Yes. WebP is supported by all modern browsers and produces 25-35% smaller files than JPEG. Smaller images mean faster page loads, which directly improves your WooCommerce store\'s Google ranking and conversion rate.',
              },
              {
                q: 'How do I bulk convert product images to WebP?',
                a: 'Upload all your images at once using Optima\'s batch upload. Select the WooCommerce preset to generate all 4 sizes automatically. Click "Generate All WooCommerce Sizes" to download a ZIP with every size for every product.',
              },
              {
                q: 'Are my images stored on the server?',
                a: 'No. Images are processed in memory and never stored. Once you download your converted files, nothing is retained on the server.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-base pb-5 last:border-0">
                <h3 className="font-semibold text-sm text-1 mb-2">{q}</h3>
                <p className="text-xs text-3 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
