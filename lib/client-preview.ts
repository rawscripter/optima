export async function estimateWebpSize(
  file: File,
  quality: number
): Promise<number | null> {
  if (!('createImageBitmap' in window)) return null;

  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob ? blob.size : null),
        'image/webp',
        quality / 100
      );
    });
  } catch {
    return null;
  }
}
