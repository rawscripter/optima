import { PassThrough } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require('archiver') as (format: string, options?: object) => import('archiver').Archiver;

export function buildZip(
  files: { filename: string; buffer: Buffer }[]
): ReadableStream<Uint8Array> {
  const passThrough = new PassThrough();
  const archive = archiver('zip', { zlib: { level: 6 } });

  archive.pipe(passThrough);

  for (const { filename, buffer } of files) {
    archive.append(buffer, { name: filename });
  }

  archive.finalize();

  return new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      passThrough.on('end', () => controller.close());
      passThrough.on('error', (err) => controller.error(err));
    },
  });
}
