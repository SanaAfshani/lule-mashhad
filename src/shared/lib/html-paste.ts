/**
 * تبدیل HTML کپی‌شده از Word / Google Docs / وردپرس / ابزارهای تولید محتوا
 * به HTML تمیز و معنایی، مناسب ذخیره در دیتابیس و رندر در صفحه مقاله.
 *
 * چرا لازم است: مرورگر موقع پیست در <textarea> فقط text/plain می‌گذارد و کل
 * فرمت از بین می‌رود. با خواندن text/html از کلیپ‌بورد و تمیز کردن آن،
 * ساختار مقاله (تیترها، لیست‌ها، لینک‌ها) حفظ می‌شود.
 */

/** تگ‌هایی که نگه می‌داریم — بقیه unwrap می‌شوند (محتوا می‌ماند، تگ حذف) */
const ALLOWED = new Set([
  'div', 'span', // فقط برای بنر نگه داشته می‌شوند؛ بقیه در stripAttrs unwrap می‌شوند
  'h2', 'h3', 'h4',
  'p', 'br',
  'ul', 'ol', 'li',
  'strong', 'em', 'u', 's',
  'a', 'img',
  'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption',
]);

/** تگ‌هایی که خودشان و کل محتوایشان حذف می‌شوند */
const DROP = new Set(['script', 'style', 'meta', 'link', 'title', 'head', 'iframe', 'object', 'embed', 'noscript']);

/** نگاشت تگ‌های قدیمی/غیرمعنایی به معادل معنایی */
const RENAME: Record<string, string> = {
  b: 'strong',
  i: 'em',
  strike: 's',
  del: 's',
  ins: 'u',
  h1: 'h2', // در صفحه مقاله h1 مخصوص عنوان است
  h5: 'h4',
  h6: 'h4',
};

/** اتریبیوت‌های مجاز برای هر تگ — بقیه (style, class, id, dir, ...) حذف می‌شوند */
const KEEP_ATTRS: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
};

const BLOCK = new Set([
  'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption',
]);

function cleanText(text: string): string {
  return text
    .replace(/ /g, ' ')       // &nbsp; → فاصله عادی
    .replace(/[​﻿]/g, '') // zero-width ها که Word تولید می‌کند
    .replace(/[ \t]+/g, ' ');
}

/** آیا این عنصر بعد از تمیزکاری چیزی برای نمایش دارد؟ */
function isEmpty(el: Element): boolean {
  if (el.tagName.toLowerCase() === 'br') return false;
  if (el.querySelector('img, br, td, th')) return false;
  return !el.textContent?.trim();
}

function walk(node: Node, doc: Document): void {
  // از آخر به اول، چون ممکن است گره‌ها را جابه‌جا یا حذف کنیم
  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    const child = node.childNodes[i];

    if (child.nodeType === Node.TEXT_NODE) {
      child.textContent = cleanText(child.textContent ?? '');
      continue;
    }
    if (child.nodeType === Node.COMMENT_NODE) {
      child.remove();
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const el = child as Element;
    const tag = el.tagName.toLowerCase();

    if (DROP.has(tag)) {
      el.remove();
      continue;
    }

    walk(el, doc);

    // تگ‌های قدیمی را به معادل معنایی تبدیل کن
    const renamed = RENAME[tag];
    if (renamed) {
      const next = doc.createElement(renamed);
      while (el.firstChild) next.appendChild(el.firstChild);
      el.replaceWith(next);
      stripAttrs(next);
      if (isEmpty(next)) next.remove();
      continue;
    }

    if (!ALLOWED.has(tag)) {
      // span/div/font/section... : تگ را بردار، محتوا را نگه دار
      el.replaceWith(...Array.from(el.childNodes));
      continue;
    }

    // div/span فقط وقتی می‌مانند که بخشی از بنر باشند
    if ((tag === 'div' || tag === 'span') && !bannerClass(el)) {
      el.replaceWith(...Array.from(el.childNodes));
      continue;
    }

    stripAttrs(el);
    if (isEmpty(el)) el.remove();
  }
}

/** فقط کلاس‌های بنر حفظ می‌شوند تا کپی/پیست مقاله بنر را خراب نکند */
function bannerClass(el: Element): string | null {
  const cls = el.getAttribute('class') ?? '';
  const kept = cls.split(/\s+/).filter((c) => /^article-banner(-[a-z]+)?$/.test(c));
  return kept.length ? kept.join(' ') : null;
}

function stripAttrs(el: Element): void {
  const keep = KEEP_ATTRS[el.tagName.toLowerCase()] ?? [];
  const banner = bannerClass(el);
  for (const attr of Array.from(el.attributes)) {
    if (!keep.includes(attr.name.toLowerCase())) el.removeAttribute(attr.name);
  }
  if (banner) el.setAttribute('class', banner);
  // لینک‌های javascript: را خنثی کن
  if (el.tagName.toLowerCase() === 'a') {
    const href = el.getAttribute('href') ?? '';
    if (/^\s*javascript:/i.test(href)) el.removeAttribute('href');
  }
}

/** خروجی خوانا: هر بلاک در خط خودش */
function format(html: string): string {
  let out = html;
  for (const tag of BLOCK) {
    out = out
      .replace(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi'), (m) => `\n${m}`)
      .replace(new RegExp(`</${tag}>`, 'gi'), (m) => `${m}\n`);
  }
  return out
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');
}

export function sanitizePastedHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  walk(doc.body, doc);
  return format(doc.body.innerHTML);
}

/** متن ساده را به پاراگراف تبدیل می‌کند (وقتی کلیپ‌بورد HTML ندارد) */
export function plainTextToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}
