import { PassThrough } from 'stream';

export function buildZip(
  files: { filename: string; buffer: Buffer }[]
): ReadableStream<Uint8Array> {
  const passThrough = new PassThrough();

  (async () => {
    const { ZipArchive } = await import('archiver');
    const archive = new ZipArchive({ zlib: { level: 6 } });
    archive.pipe(passThrough);
    for (const { filename, buffer } of files) {
      archive.append(buffer, { name: filename });
    }
    await archive.finalize();
  })().catch((err) => passThrough.destroy(err));

  return new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      passThrough.on('end', () => controller.close());
      passThrough.on('error', (err) => controller.error(err));
    },
  });
}
