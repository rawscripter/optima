import { NextRequest } from 'next/server';
import { convert } from '@/lib/sharp-worker';
import { buildZip } from '@/lib/zip-builder';
import { WOO_PRESETS } from '@/lib/presets';

// Generates all 4 WooCommerce sizes for every uploaded file.
// ZIP structure: thumbnail/name.webp  gallery/name.webp  hero/name.webp  catalog/name.webp
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll('files') as File[];
    const renamesRaw = form.get('renames') as string | null;
    const cropsRaw = form.get('crops') as string | null;

    if (!files.length) return new Response(JSON.stringify({ error: 'No files' }), { status: 400 });

    const renames: string[] | null = renamesRaw ? JSON.parse(renamesRaw) : null;
    const crops: Array<{ cx: number; cy: number } | null> = cropsRaw ? JSON.parse(cropsRaw) : [];

    const entries: { filename: string; buffer: Buffer }[] = [];

    await Promise.all(
      files.map(async (file, i) => {
        const input = Buffer.from(await file.arrayBuffer());
        const baseName = (renames?.[i] ?? file.name).replace(/\.[^.]+$/, '');
        const cropFocus = crops[i] ?? undefined;
        console.log('[woo-all] processing', file.name, 'input size', input.length);

        await Promise.all(
          WOO_PRESETS.map(async (preset) => {
            console.log('[woo-all] converting', preset.id, 'for', baseName);
            const { buffer, ext } = await convert(input, preset, cropFocus);
            console.log('[woo-all] done', preset.id, buffer.length);
            entries.push({ filename: `${preset.id}/${baseName}.${ext}`, buffer });
          })
        );
      })
    );
    console.log('[woo-all] all done, entries:', entries.length);

    return new Response(buildZip(entries), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="woocommerce-images.zip"',
      },
    });
  } catch (err) {
    console.error('[woo-all]', err);
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
