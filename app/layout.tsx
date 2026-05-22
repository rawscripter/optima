import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const siteUrl = 'https://optima.appluto.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Optima — Free WebP Image Optimizer for WooCommerce & WordPress',
  description: 'Batch convert product images to WebP for WooCommerce. Auto-resize to thumbnail (150×150), gallery (1000×1000), hero, and catalog sizes. Free, no signup required.',
  keywords: [
    'webp image converter',
    'woocommerce image optimizer',
    'wordpress image resize',
    'batch webp converter',
    'product image optimizer',
    'convert jpg to webp',
    'woocommerce product images',
    'image compression tool',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Optima — Free WebP Image Optimizer for WooCommerce',
    description: 'Batch convert product images to WebP. WooCommerce presets, visual crop tool, ZIP export. Free, no signup.',
    url: siteUrl,
    siteName: 'Optima',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Optima — Free WebP Image Optimizer for WooCommerce',
    description: 'Batch convert product images to WebP. WooCommerce presets, visual crop tool, ZIP export.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Optima',
      url: siteUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free WebP image optimizer for WooCommerce. Batch convert product images to all WooCommerce sizes.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What size should WooCommerce product images be?',
          acceptedAnswer: { '@type': 'Answer', text: 'WooCommerce recommends 800×800px minimum. Optima generates thumbnail (150×150), catalog (600×600), gallery (1000×1000), and hero (1920×600) sizes automatically.' },
        },
        {
          '@type': 'Question',
          name: 'Should I use WebP for WooCommerce?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. WebP produces 25-35% smaller files than JPEG, improving page load speed and Google rankings.' },
        },
        {
          '@type': 'Question',
          name: 'How do I bulk convert product images to WebP?',
          acceptedAnswer: { '@type': 'Answer', text: 'Upload all images at once in Optima, select the WooCommerce preset, and click "Generate All WooCommerce Sizes" to download a ZIP with every size for every product.' },
        },
        {
          '@type': 'Question',
          name: 'Are my images stored on the server?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. Images are processed in memory and never stored. Nothing is retained after you download your files.' },
        },
      ],
    },
  ],
};

const themeScript = `(function(){
  try {
    var t = localStorage.getItem('optima-theme');
    var p = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(t || p);
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
