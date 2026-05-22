import { PassThrough } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { ZipArchive } = require('archiver') as { ZipArchive: new (options?: object) => {
  pipe(dest: NodeJS.WritableStream): void;
  append(source: Buffer, data: { name: string }): void;
  finalize(): void;
} };

export function buildZip(
  files: { filename: string; buffer: Buffer }[]
): ReadableStream<Uint8Array> {
  const passThrough = new PassThrough();

  const archive = new ZipArchive({ zlib: { level: 6 } });
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
