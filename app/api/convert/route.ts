import { NextRequest, NextResponse } from 'next/server';
import { convertToWebP } from '@/lib/sharp-worker';
import { getPreset } from '@/lib/presets';
import type { CustomSettings } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const presetId = form.get('preset') as string | null;
    const customRaw = form.get('customSettings') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const options: CustomSettings =
      presetId === 'custom' && customRaw
        ? (JSON.parse(customRaw) as CustomSettings)
        : getPreset(presetId ?? 'gallery');

    const { buffer: webpBuffer, width, height } = await convertToWebP(buffer, options);

    const baseName = file.name.replace(/\.[^.]+$/, '');
    const filename = `${baseName}.webp`;
    const dataURL = `data:image/webp;base64,${webpBuffer.toString('base64')}`;

    return NextResponse.json({
      filename,
      dataURL,
      originalSize: buffer.length,
      outputSize: webpBuffer.length,
      width,
      height,
    });
  } catch (err) {
    console.error('[convert]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}
