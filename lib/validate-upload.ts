const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40MB
const MAX_FILES = 20;

// Magic bytes for allowed image formats
const IMAGE_SIGNATURES: [number[], string][] = [
  [[0xff, 0xd8, 0xff], 'image/jpeg'],
  [[0x89, 0x50, 0x4e, 0x47], 'image/png'],
  [[0x47, 0x49, 0x46, 0x38], 'image/gif'],
  [[0x52, 0x49, 0x46, 0x46], 'image/webp'], // RIFF (need further check)
  [[0x00, 0x00, 0x00], 'image/avif'],        // ftyp box, relaxed check
];

function detectImageType(buf: Buffer): boolean {
  for (const [sig] of IMAGE_SIGNATURES) {
    if (sig.every((byte, i) => buf[i] === byte)) return true;
  }
  // AVIF/HEIF: bytes 4-7 are 'ftyp'
  if (buf.length > 8 && buf.slice(4, 8).toString('ascii') === 'ftyp') return true;
  return false;
}

export function sanitizeFilename(raw: string): string {
  return (
    raw
      .replace(/\.[^.]+$/, '')       // strip extension
      .replace(/\.\./g, '_')         // no ..
      .replace(/[/\\:*?"<>|]/g, '_') // no path chars
      .replace(/[\x00-\x1f]/g, '_')  // no control chars
      .slice(0, 100)                  // max length
      .trim() || 'image'
  );
}

export function validateFiles(files: File[]): string | null {
  if (!files.length) return 'No files provided';
  if (files.length > MAX_FILES) return `Max ${MAX_FILES} files per request`;
  return null;
}

export async function validateImageBuffer(buf: Buffer, filename: string): Promise<string | null> {
  if (buf.length > MAX_FILE_SIZE) return `${filename}: exceeds 40MB limit`;
  if (buf.length < 8) return `${filename}: file too small`;
  if (!detectImageType(buf)) return `${filename}: not a valid image file`;
  return null;
}
