import { isBlobEnabled } from '@/shared/lib/blob-support';

const ENDPOINT = '/api/upload/pdf';
const MAX_MB = 100;

/**
 * آپلود PDF:
 *  - اگر Vercel Blob فعال باشد: آپلود مستقیم از مرورگر به CDN (بدون محدودیت ۴.۵ مگابایتی serverless)
 *  - در غیر این صورت: ارسال FormData به سرور و ذخیره در public/uploads
 */
export async function uploadPdf(file: File, onProgress?: (pct: number) => void): Promise<string> {
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`حجم فایل نباید بیشتر از ${MAX_MB} مگابایت باشد`);
  }
  if (file.type !== 'application/pdf') {
    throw new Error('فقط فایل PDF مجاز است');
  }

  if (await isBlobEnabled(ENDPOINT)) {
    const { upload } = await import('@vercel/blob/client');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blob = await upload(`pdfs/${Date.now()}-${safeName}`, file, {
      access: 'public',
      handleUploadUrl: ENDPOINT,
      onUploadProgress: ({ percentage }) => onProgress?.(percentage),
    });
    return blob.url;
  }

  // مسیر سرور پیشرفت واقعی ندارد؛ با XHR پیشرفت آپلود را گزارش می‌کنیم
  return new Promise<string>((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', ENDPOINT);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText) as { success?: boolean; url?: string; error?: string };
        if (xhr.status >= 200 && xhr.status < 300 && json.success && json.url) resolve(json.url);
        else reject(new Error(json.error ?? 'آپلود ناموفق بود'));
      } catch {
        reject(new Error('پاسخ نامعتبر از سرور'));
      }
    };
    xhr.onerror = () => reject(new Error('خطا در ارتباط با سرور'));
    xhr.send(fd);
  });
}
