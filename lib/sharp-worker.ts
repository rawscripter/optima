import sharp from 'sharp';
import type { Preset, CustomSettings } from '@/types';

type Options = Preset | CustomSettings;

function ext(options: Options) {
  return options.outputFormat === 'avif' ? 'avif' : 'webp';
}

function mimeType(options: Options) {
  return options.outputFormat === 'avif' ? 'image/avif' : 'image/webp';
}

async function runPipeline(
  input: Buffer,
  options: Options,
  quality: number,
  extractRegion?: { left: number; top: number; width: number; height: number }
): Promise<sharp.OutputInfo & { data: Buffer }> {
  let pipeline = sharp(input, {
    animated: options.animated,
    limitInputPixels: 268402689,
  });

  if (options.preserveMetadata) {
    pipeline = pipeline.withMetadata();
  }

  if (extractRegion) {
    pipeline = pipeline
      .extract(extractRegion)
      .resize({
        width: options.width ?? undefined,
        height: options.height ?? undefined,
        fit: 'fill',
        kernel: 'lanczos3',
        fastShrinkOnLoad: false,
      });
  } else if (options.width || options.height) {
    pipeline = pipeline.resize({
      width: options.width ?? undefined,
      height: options.height ?? undefined,
      fit: options.fit,
      withoutEnlargement: true,
      kernel: 'lanczos3',
      fastShrinkOnLoad: false,
    });
  }

  let out: sharp.Sharp;
  if (options.outputFormat === 'avif') {
    out = pipeline.avif({
      quality,
      effort: Math.min(Math.round(options.effort * 9 / 6), 9),
      lossless: options.lossless,
    });
  } else {
    out = pipeline.webp({
      quality,
      effort: options.effort,
      lossless: options.lossless,
      nearLossless: options.nearLossless,
      smartSubsample: options.smartSubsample,
      preset: options.sharpPreset,
    });
  }

  const result = await out.toBuffer({ resolveWithObject: true });
  return { ...result.info, data: result.data };
}

export async function convert(
  input: Buffer,
  options: Options,
  cropFocus?: { cx: number; cy: number }
): Promise<{ buffer: Buffer; width: number; height: number; ext: string; mimeType: string }> {
  let extractRegion: { left: number; top: number; width: number; height: number } | undefined;

  if (cropFocus && options.fit === 'cover' && options.width && options.height) {
    const meta = await sharp(input).metadata();
    const srcW = meta.width!;
    const srcH = meta.height!;
    const scale = Math.min(srcW / options.width, srcH / options.height);
    const cropW = Math.round(options.width * scale);
    const cropH = Math.round(options.height * scale);
    const cx = cropFocus.cx * srcW;
    const cy = cropFocus.cy * srcH;
    const left = Math.round(Math.max(0, Math.min(srcW - cropW, cx - cropW / 2)));
    const top = Math.round(Math.max(0, Math.min(srcH - cropH, cy - cropH / 2)));
    extractRegion = { left, top, width: cropW, height: cropH };
  }

  const initial = await runPipeline(input, options, options.quality, extractRegion);

  let best = initial;

  if (options.targetSizeKB && initial.data.length > options.targetSizeKB * 1024) {
    const targetBytes = options.targetSizeKB * 1024;
    let lo = 10, hi = options.quality - 1;

    for (let i = 0; i < 8 && lo <= hi; i++) {
      const mid = Math.round((lo + hi) / 2);
      const trial = await runPipeline(input, options, mid, extractRegion);
      if (trial.data.length <= targetBytes) { best = trial; lo = mid + 1; }
      else hi = mid - 1;
    }
  }

  return {
    buffer: best.data,
    width: best.width,
    height: best.height,
    ext: ext(options),
    mimeType: mimeType(options),
  };
}

// Legacy alias used by existing route code
export const convertToWebP = convert;
