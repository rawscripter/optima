import { NextRequest } from 'next/server';
import { convert } from '@/lib/sharp-worker';
import { buildZip } from '@/lib/zip-builder';
import { WOO_PRESETS } from '@/lib/presets';
import { validateFiles, validateImageBuffer, sanitizeFilename } from '@/lib/validate-upload';

// Generates all 4 WooCommerce sizes for every uploaded file.
// ZIP structure: thumbnail/name.webp  gallery/name.webp  hero/name.webp  catalog/name.webp
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll('files') as File[];
    const renamesRaw = form.get('renames') as string | null;
    const cropsRaw = form.get('crops') as string | null;

    const filesError = validateFiles(files);
    if (filesError) return new Response(JSON.stringify({ error: filesError }), { status: 400 });

    let renames: string[] | null = null;
    let crops: Array<{ cx: number; cy: number } | null> = [];
    try {
      if (renamesRaw) renames = JSON.parse(renamesRaw);
      if (cropsRaw) crops = JSON.parse(cropsRaw);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), { status: 400 });
    }

    const entries: { filename: string; buffer: Buffer }[] = [];

    await Promise.all(
      files.map(async (file, i) => {
        const input = Buffer.from(await file.arrayBuffer());

        const validationError = await validateImageBuffer(input, file.name);
        if (validationError) throw new Error(validationError);

        const rawName = Array.isArray(renames) && renames[i] ? renames[i] : file.name;
        const baseName = sanitizeFilename(rawName);

        const crop = Array.isArray(crops) ? crops[i] : null;
        const cropFocus = (crop && typeof crop.cx === 'number' && typeof crop.cy === 'number' &&
          crop.cx >= 0 && crop.cx <= 1 && crop.cy >= 0 && crop.cy <= 1)
          ? { cx: crop.cx, cy: crop.cy }
          : undefined;

        await Promise.all(
          WOO_PRESETS.map(async (preset) => {
            const { buffer, ext } = await convert(input, preset, cropFocus);
            entries.push({ filename: `${preset.id}/${baseName}.${ext}`, buffer });
          })
        );
      })
    );

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
