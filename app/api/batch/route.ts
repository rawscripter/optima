import { NextRequest } from 'next/server';
import { convert } from '@/lib/sharp-worker';
import { buildZip } from '@/lib/zip-builder';
import { getPreset, PRESET_IDS } from '@/lib/presets';
import type { CustomSettings } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll('files') as File[];
    const presetId = form.get('preset') as string | null;
    const customRaw = form.get('customSettings') as string | null;
    const renamesRaw = form.get('renames') as string | null;

    if (!files.length) return new Response(JSON.stringify({ error: 'No files' }), { status: 400 });

    const isBuiltIn = presetId && PRESET_IDS.has(presetId) && presetId !== 'custom';
    const options: CustomSettings = isBuiltIn
      ? getPreset(presetId!)
      : customRaw ? JSON.parse(customRaw) : getPreset('gallery');

    const renames: string[] | null = renamesRaw ? JSON.parse(renamesRaw) : null;

    const converted = await Promise.all(
      files.map(async (file, i) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { buffer: outBuffer, ext } = await convert(buffer, options);
        const fallback = file.name.replace(/\.[^.]+$/, `.${ext}`);
        return { filename: renames?.[i] ?? fallback, buffer: outBuffer };
      })
    );

    return new Response(buildZip(converted), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="optima-export.zip"',
      },
    });
  } catch (err) {
    console.error('[batch]', err);
    return new Response(JSON.stringify({ error: 'Batch failed' }), { status: 500 });
  }
}
