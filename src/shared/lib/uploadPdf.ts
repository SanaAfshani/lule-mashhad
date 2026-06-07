/**
 * Smart PDF uploader:
 *  - On Vercel (with BLOB_READ_WRITE_TOKEN): client-side direct upload to CDN
 *    → file never passes through the serverless function → no 4.5 MB limit
 *  - Local dev / no token: POST FormData to server → saved to public/uploads
 */
export async function uploadPdf(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const MAX_MB = 100;
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`حجم فایل نباید بیشتر از ${MAX_MB} مگابایت باشد`);
  }
  if (file.type !== 'application/pdf') {
    throw new Error('فقط فایل PDF مجاز است');
  }

  // ── Try client-upload (Vercel Blob) first ────────────────────────────────
  try {
    const { upload } = await import('@vercel/blob/client');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `pdfs/${Date.now()}-${safeName}`;

    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/upload/pdf',
      onUploadProgress: ({ percentage }) => onProgress?.(percentage),
    });

    return blob.url;
  } catch (blobErr) {
    // If blob token isn't configured, fall back to server-side FormData upload
    const isTokenMissing =
      blobErr instanceof Error &&
      (blobErr.message.includes('token') ||
        blobErr.message.includes('BLOB') ||
        blobErr.message.includes('401') ||
        blobErr.message.includes('403'));

    if (!isTokenMissing) {
      // Real upload error — re-throw
      throw blobErr;
    }
  }

  // ── Fallback: FormData → server ──────────────────────────────────────────
  const fd = new FormData();
  fd.append('file', file);

  const res = await fetch('/api/upload/pdf', { method: 'POST', body: fd });
  const json = (await res.json()) as { success: boolean; url?: string; error?: string };

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? 'آپلود ناموفق بود');
  }

  return json.url!;
}
