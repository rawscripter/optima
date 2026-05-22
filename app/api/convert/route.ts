import { NextRequest, NextResponse } from 'next/server';
import { convert } from '@/lib/sharp-worker';
import { getPreset, PRESET_IDS } from '@/lib/presets';
import { validateImageBuffer, sanitizeFilename } from '@/lib/validate-upload';
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

    const validationError = await validateImageBuffer(buffer, file.name);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const isBuiltIn = presetId && PRESET_IDS.has(presetId) && presetId !== 'custom';
    let options: CustomSettings;
    try {
      options = isBuiltIn ? getPreset(presetId!) : customRaw ? JSON.parse(customRaw) : getPreset('gallery');
    } catch {
      return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
    }

    const cropCx = cropCxRaw ? parseFloat(cropCxRaw) : NaN;
    const cropCy = cropCyRaw ? parseFloat(cropCyRaw) : NaN;
    const cropFocus = (!isNaN(cropCx) && !isNaN(cropCy) && cropCx >= 0 && cropCx <= 1 && cropCy >= 0 && cropCy <= 1)
      ? { cx: cropCx, cy: cropCy }
      : undefined;

    const { buffer: outBuffer, width, height, ext, mimeType } = await convert(buffer, options, cropFocus);

    const baseName = sanitizeFilename(file.name);
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
