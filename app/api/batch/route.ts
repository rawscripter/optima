import { NextRequest } from 'next/server';
import { convertToWebP } from '@/lib/sharp-worker';
import { buildZip } from '@/lib/zip-builder';
import { getPreset } from '@/lib/presets';
import type { CustomSettings } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll('files') as File[];
    const presetId = form.get('preset') as string | null;
    const customRaw = form.get('customSettings') as string | null;

    if (!files.length) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const options: CustomSettings =
      presetId === 'custom' && customRaw
        ? (JSON.parse(customRaw) as CustomSettings)
        : getPreset(presetId ?? 'gallery');

    const converted = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { buffer: webpBuffer } = await convertToWebP(buffer, options);
        const baseName = file.name.replace(/\.[^.]+$/, '');
        return { filename: `${baseName}.webp`, buffer: webpBuffer };
      })
    );

    const zipStream = buildZip(converted);

    return new Response(zipStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="optima-export.zip"',
      },
    });
  } catch (err) {
    console.error('[batch]', err);
    return new Response(JSON.stringify({ error: 'Batch conversion failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
