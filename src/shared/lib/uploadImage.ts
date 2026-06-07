export async function uploadImage(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error('حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد');
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) throw new Error('فقط JPG، PNG و WebP مجاز است');

  // Try client-side Vercel Blob upload first
  try {
    const { upload } = await import('@vercel/blob/client');
    const ext = file.name.split('.').pop() ?? 'jpg';
    const blob = await upload(`images/${Date.now()}.${ext}`, file, {
      access: 'public',
      handleUploadUrl: '/api/upload/image',
    });
    return blob.url;
  } catch (err) {
    const isTokenMissing =
      err instanceof Error &&
      (err.message.includes('token') ||
        err.message.includes('BLOB') ||
        err.message.includes('401') ||
        err.message.includes('403'));
    if (!isTokenMissing) throw err;
  }

  // Fallback: FormData
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload/image', { method: 'POST', body: fd });
  const json = (await res.json()) as { success: boolean; url?: string; error?: string };
  if (!res.ok || !json.success) throw new Error(json.error ?? 'آپلود ناموفق بود');
  return json.url!;
}
