import type { FaqItem } from '@/shared/types';
import { markdownToHtml, looksLikeMarkdown } from '@/shared/lib/markdown-to-html';
import { sanitizePastedHtml } from '@/shared/lib/html-paste';
import { slugify, stripHtml } from '@/shared/lib/utils';

/** فیلدهای مقاله پس از نگاشت — همان چیزی که فرم ادمین می‌خواهد */
export type ImportedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  ogTitle: string;
  ogDescription: string;
  faqs: FaqItem[];
};

export type ImportField = keyof ImportedArticle;

export const FIELD_LABELS: Record<ImportField, string> = {
  title: 'عنوان مقاله',
  slug: 'اسلاگ آدرس',
  excerpt: 'خلاصه',
  content: 'متن مقاله',
  metaTitle: 'عنوان سئو',
  metaDescription: 'توضیحات متا',
  focusKeyword: 'کلمه کلیدی محوری',
  ogTitle: 'عنوان شبکه‌های اجتماعی',
  ogDescription: 'توضیحات شبکه‌های اجتماعی',
  faqs: 'سوالات متداول',
};

type Raw = Record<string, unknown>;

/** هم snake_case و هم camelCase پذیرفته می‌شود */
function pick(src: Raw, ...keys: string[]): string {
  for (const k of keys) {
    const v = src[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

/**
 * سوالات متداول را از دو شکل ممکن می‌خواند:
 *  ۱. FAQPage schema.org — { mainEntity: [{ name, acceptedAnswer: { text } }] }
 *  ۲. آرایه ساده — [{ question, answer }]
 */
function extractFaqs(src: Raw): FaqItem[] {
  const candidates = [src.faq_schema, src.faqSchema, src.faqs, src.faq];

  for (const c of candidates) {
    if (!c) continue;

    const list = Array.isArray(c)
      ? c
      : Array.isArray((c as Raw).mainEntity)
        ? ((c as Raw).mainEntity as unknown[])
        : null;
    if (!list) continue;

    const items = list
      .map((entry) => {
        const e = entry as Raw;
        const question = String(e.name ?? e.question ?? '').trim();
        const answerRaw = e.acceptedAnswer ?? e.answer ?? '';
        const answer =
          typeof answerRaw === 'string'
            ? answerRaw.trim()
            : String((answerRaw as Raw)?.text ?? '').trim();
        return { question, answer };
      })
      .filter((f) => f.question && f.answer);

    if (items.length) return items;
  }
  return [];
}

/** محتوا ممکن است Markdown باشد (خروجی ابزار) یا HTML — هر دو به HTML تمیز تبدیل می‌شوند */
function normalizeContent(raw: string): string {
  if (!raw) return '';
  const hasHtml = /<(p|h[1-6]|ul|ol|li|div|table|strong|em|a|img)\b/i.test(raw);
  if (hasHtml && !looksLikeMarkdown(raw)) return sanitizePastedHtml(raw);
  return markdownToHtml(raw);
}

export type ParseResult =
  | { ok: true; data: ImportedArticle; found: ImportField[]; notes: string[] }
  | { ok: false; error: string };

export function parseArticleJson(input: string): ParseResult {
  const text = input.trim();
  if (!text) return { ok: false, error: 'چیزی وارد نشده است' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'JSON معتبر نیست — متن را کامل و بدون تغییر کپی کنید' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: 'ساختار JSON باید یک آبجکت باشد' };
  }

  // خروجی ممکن است در { data: ... } یا { article: ... } پیچیده شده باشد
  let src = parsed as Raw;
  for (const wrapper of ['article', 'data', 'result']) {
    const inner = src[wrapper];
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      src = inner as Raw;
      break;
    }
  }

  const notes: string[] = [];
  const title = pick(src, 'title', 'name');
  const rawContent = pick(src, 'content', 'body', 'markdown', 'html');
  const content = normalizeContent(rawContent);

  if (rawContent && !content) notes.push('متن مقاله قابل تبدیل نبود و خالی ماند.');

  const slugRaw = pick(src, 'slug', 'permalink');
  const data: ImportedArticle = {
    title,
    slug: slugRaw ? slugify(slugRaw) : '',
    excerpt: pick(src, 'excerpt', 'summary', 'description'),
    content,
    metaTitle: pick(src, 'meta_title', 'metaTitle', 'seo_title'),
    metaDescription: pick(src, 'meta_description', 'metaDescription', 'seo_description'),
    focusKeyword: pick(src, 'focus_keyword', 'focusKeyword', 'keyword'),
    ogTitle: pick(src, 'og_title', 'ogTitle'),
    ogDescription: pick(src, 'og_description', 'ogDescription'),
    faqs: extractFaqs(src),
  };

  const found = (Object.keys(FIELD_LABELS) as ImportField[]).filter((k) => {
    const v = data[k];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  });

  if (!found.length) {
    return { ok: false, error: 'هیچ فیلد شناخته‌شده‌ای در این JSON پیدا نشد' };
  }

  // تصویر شاخص عمداً وارد نمی‌شود: مسیر سرورِ ابزار است و از سایت ما قابل دسترسی نیست
  if (pick(src, 'image_path', 'imagePath', 'image')) {
    notes.push('تصویر شاخص وارد نشد — آن را دستی آپلود کنید.');
  }

  return { ok: true, data, found, notes };
}

/** فیلدهایی که فقط در JSON هستند و از Markdown قابل استخراج نیستند */
export const JSON_ONLY_FIELDS: ImportField[] = [
  'metaTitle',
  'metaDescription',
  'focusKeyword',
  'ogTitle',
  'ogDescription',
];

const FAQ_HEADING = /^##\s*.*(سوالات متداول|سوال‌های متداول|پرسش‌های متداول|FAQ)/im;

/**
 * سوالات متداول را از بخش «## سوالات متداول» جدا می‌کند.
 * ابزار تولید محتوا این بخش را داخل خود Markdown می‌گذارد؛ ما آن را به فیلد
 * اختصاصی سوالات منتقل می‌کنیم تا هم آکاردئون بگیرد و هم FAQPage schema.
 */
function splitFaqSection(markdown: string): { body: string; faqs: FaqItem[] } {
  const match = markdown.match(FAQ_HEADING);
  if (!match || match.index === undefined) return { body: markdown, faqs: [] };

  const start = match.index;
  const after = markdown.slice(start + match[0].length);
  // بخش تا تیتر ## بعدی ادامه دارد
  const nextH2 = after.search(/^##\s/m);
  const section = nextH2 >= 0 ? after.slice(0, nextH2) : after;
  const rest = nextH2 >= 0 ? after.slice(nextH2) : '';

  const faqs: FaqItem[] = [];
  const parts = section.split(/^###\s+/m).slice(1);
  for (const part of parts) {
    const lines = part.split('\n');
    const question = (lines.shift() ?? '').trim();
    const answer = lines
      .join('\n')
      .split(/\n\s*\n/)
      .map((b) => stripHtml(b.replace(/^[-*+]\s+/gm, '').replace(/\*\*/g, '')).trim())
      .filter(Boolean)
      .join(' ')
      .trim();
    if (question && answer) faqs.push({ question, answer });
  }

  if (!faqs.length) return { body: markdown, faqs: [] };
  return { body: (markdown.slice(0, start) + rest).trim(), faqs };
}

/**
 * ورودی Markdown خام (خروجی دکمه «کپی Markdown»).
 * عنوان، خلاصه، متن و سوالات متداول از آن درمی‌آید؛ فیلدهای سئو در Markdown
 * وجود ندارند و باید دستی وارد شوند.
 */
export function parseArticleMarkdown(input: string): ParseResult {
  const text = input.trim();
  if (!text) return { ok: false, error: 'چیزی وارد نشده است' };

  const titleMatch = text.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const { body, faqs } = splitFaqSection(text);

  // اولین پاراگراف بعد از عنوان، خلاصه پیش‌فرض است
  const withoutTitle = title ? body.replace(/^#\s+.+$/m, '').trim() : body;
  const firstParagraph = withoutTitle
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^[#>\-*|]/.test(b));
  const excerpt = firstParagraph
    ? stripHtml(firstParagraph.replace(/\*\*/g, '')).slice(0, 180).trim()
    : '';

  const content = markdownToHtml(body);
  if (!content) return { ok: false, error: 'متن قابل تبدیل نبود — مطمئن شوید Markdown کامل کپی شده' };

  const data: ImportedArticle = {
    title,
    slug: title ? slugify(title) : '',
    excerpt,
    content,
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    ogTitle: '',
    ogDescription: '',
    faqs,
  };

  const found = (Object.keys(FIELD_LABELS) as ImportField[]).filter((k) => {
    const v = data[k];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  });

  const notes = [
    'عنوان سئو، توضیحات متا، کلمه کلیدی و فیلدهای شبکه‌های اجتماعی در Markdown نیستند — آن‌ها را از بخش «تنظیمات سئو» ابزار کپی کنید. اگر خالی بمانند، سایت خودکار از عنوان و خلاصه مقاله استفاده می‌کند.',
  ];
  if (faqs.length) {
    notes.push(`بخش «سوالات متداول» از متن جدا شد و به ${faqs.length} سوال تبدیل شد.`);
  }

  return { ok: true, data, found, notes };
}

/** تشخیص خودکار ورودی: JSON یا Markdown */
export function parseArticleInput(input: string): ParseResult & { kind?: 'json' | 'markdown' } {
  const text = input.trim();
  if (!text) return { ok: false, error: 'چیزی وارد نشده است' };

  if (text.startsWith('{') || text.startsWith('[')) {
    return { ...parseArticleJson(text), kind: 'json' };
  }
  return { ...parseArticleMarkdown(text), kind: 'markdown' };
}
