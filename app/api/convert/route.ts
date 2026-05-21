import { NextRequest, NextResponse } from 'next/server';
import { convert } from '@/lib/sharp-worker';
import { getPreset, PRESET_IDS } from '@/lib/presets';
import type { CustomSettings } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const presetId = form.get('preset') as string | null;
    const customRaw = form.get('customSettings') as string | null;
    const cropCxRaw = form.get('cropCx') as string | null;
    const cropCyRaw = form.get('cropCy') as string | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const isBuiltIn = presetId && PRESET_IDS.has(presetId) && presetId !== 'custom';
    const options: CustomSettings = isBuiltIn
      ? getPreset(presetId!)
      : customRaw ? JSON.parse(customRaw) : getPreset('gallery');

    const cropFocus = (cropCxRaw && cropCyRaw)
      ? { cx: parseFloat(cropCxRaw), cy: parseFloat(cropCyRaw) }
      : undefined;

    const { buffer: outBuffer, width, height, ext, mimeType } = await convert(buffer, options, cropFocus);

    const baseName = file.name.replace(/\.[^.]+$/, '');
    return NextResponse.json({
      filename: `${baseName}.${ext}`,
      dataURL: `data:${mimeType};base64,${outBuffer.toString('base64')}`,
      originalSize: buffer.length,
      outputSize: outBuffer.length,
      width,
      height,
      format: ext,
    });
  } catch (err) {
    console.error('[convert]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}
