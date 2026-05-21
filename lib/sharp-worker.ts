import sharp from 'sharp';
import type { Preset, CustomSettings } from '@/types';

export async function convertToWebP(
  input: Buffer,
  options: Preset | CustomSettings
): Promise<{ buffer: Buffer; width: number; height: number }> {
  let pipeline = sharp(input, {
    animated: options.animated,
    limitInputPixels: 268402689,
  });

  if (options.width || options.height) {
    pipeline = pipeline.resize({
      width: options.width ?? undefined,
      height: options.height ?? undefined,
      fit: options.fit,
      withoutEnlargement: true,
      kernel: 'lanczos3',
      fastShrinkOnLoad: false,
    });
  }

  const result = await pipeline
    .webp({
      quality: options.quality,
      effort: options.effort,
      lossless: options.lossless,
      nearLossless: options.nearLossless,
      smartSubsample: options.smartSubsample,
      preset: options.sharpPreset,
    })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
  };
}
