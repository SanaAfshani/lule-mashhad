import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin user ───────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luleonline.ir' },
    update: { password: hashedPassword, role: 'ADMIN' },
    create: {
      name: 'مدیر سیستم',
      email: 'admin@luleonline.ir',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // ─── Categories (water/sewage industry) ──────────────
  const categories = [
    { name: 'لوله پلیکا (PVC)', slug: 'pvc-pipes', description: 'لوله‌های PVC سخت برای آب‌رسانی، فاضلاب و آبیاری', icon: '💧', order: 1 },
    { name: 'لوله پلی اتیلن',  slug: 'polyethylene-pipes', description: 'لوله PE80 و PE100 برای آب‌رسانی شهری', icon: '🔵', order: 2 },
    { name: 'لوله چدن داکتیل', slug: 'cast-iron-pipes', description: 'لوله چدن داکتیل تحت فشار برای شبکه آب', icon: '⚙️', order: 3 },
    { name: 'منهول و دریچه',   slug: 'manholes', description: 'منهول پلیمری و بتنی و دریچه فاضلاب', icon: '🔩', order: 4 },
    { name: 'اتصالات آب و فاضلاب', slug: 'fittings', description: 'زانو، سه‌راه، ردوسر و کوپلینگ PVC و PE', icon: '🔧', order: 5 },
    { name: 'شیرآلات صنعتی',  slug: 'valves', description: 'شیر کشویی، پروانه‌ای و سوپاپ یکطرفه', icon: '🚰', order: 6 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, image: `/images/categories/${cat.slug}.jpg` },
    });
    createdCategories[cat.slug] = c.id;
  }

  // ─── Products ─────────────────────────────────────────
  const products = [
    {
      name: 'لوله پلیکا ۱۶۰ میلیمتر سری ۱۰۰',
      slug: 'pvc-pipe-160mm-series100',
      shortDescription: 'لوله PVC سخت قطر ۱۶۰ میلیمتر، سری ۱۰۰ برای فاضلاب شهری',
      description: 'لوله PVC سخت قطر ۱۶۰ میلیمتر مطابق استاندارد ISIRI 4467 برای خطوط فاضلاب شهری.',
      inStock: true, featured: true, categoryId: createdCategories['pvc-pipes'],
      images: JSON.stringify([]), specifications: JSON.stringify({ 'قطر': '۱۶۰mm', 'سری': '۱۰۰', 'استاندارد': 'ISIRI 4467', 'رنگ': 'نارنجی' }),
    },
    {
      name: 'لوله پلیکا ۱۱۰ میلیمتر سری ۱۲۵',
      slug: 'pvc-pipe-110mm-series125',
      shortDescription: 'لوله PVC قطر ۱۱۰ برای آب‌رسانی و فاضلاب ساختمانی',
      description: 'لوله PVC سخت قطر ۱۱۰ میلیمتر سری ۱۲۵ مناسب برای تأسیسات ساختمانی.',
      inStock: true, featured: true, categoryId: createdCategories['pvc-pipes'],
      images: JSON.stringify([]), specifications: JSON.stringify({ 'قطر': '۱۱۰mm', 'سری': '۱۲۵', 'رنگ': 'نارنجی' }),
    },
    {
      name: 'لوله پلی اتیلن PE100 قطر ۲۵۰ میلیمتر',
      slug: 'pe100-250mm',
      shortDescription: 'لوله HDPE PE100 قطر ۲۵۰ برای آب‌رسانی شهری تحت فشار',
      description: 'لوله پلی اتیلن با چگالی بالا PE100 مطابق استاندارد ISO 4427.',
      inStock: true, featured: true, categoryId: createdCategories['polyethylene-pipes'],
      images: JSON.stringify([]), specifications: JSON.stringify({ 'قطر': '۲۵۰mm', 'درجه': 'PE100', 'استاندارد': 'ISO 4427', 'رنگ': 'مشکی/آبی' }),
    },
    {
      name: 'لوله چدن داکتیل DN 200',
      slug: 'ductile-iron-dn200',
      shortDescription: 'لوله چدن داکتیل DN 200 PN 16 برای شبکه آب تحت فشار',
      description: 'لوله چدن داکتیل مطابق استاندارد EN 545 با پوشش ملات سیمان داخلی.',
      inStock: true, featured: false, categoryId: createdCategories['cast-iron-pipes'],
      images: JSON.stringify([]), specifications: JSON.stringify({ 'قطر': 'DN200', 'فشار': 'PN16', 'استاندارد': 'EN 545', 'پوشش': 'ملات سیمان' }),
    },
    {
      name: 'منهول پلیمری D400 قطر ۶۰۰',
      slug: 'polymer-manhole-d400-600',
      shortDescription: 'منهول پلیمری مقاوم D400 با قطر دهانه ۶۰۰ میلیمتر',
      description: 'منهول پلیمری کلاس D400 مناسب برای معابر شهری با ترافیک سنگین.',
      inStock: true, featured: false, categoryId: createdCategories['manholes'],
      images: JSON.stringify([]), specifications: JSON.stringify({ 'کلاس': 'D400', 'قطر': '۶۰۰mm', 'جنس': 'پلیمری', 'ارتفاع': '۶۰۰mm' }),
    },
    {
      name: 'زانوی PVC 90° قطر ۱۶۰ میلیمتر',
      slug: 'pvc-elbow-90-160mm',
      shortDescription: 'زانوی PVC ۹۰ درجه قطر ۱۶۰ برای سیستم فاضلاب',
      description: 'زانوی PVC تزریقی ۹۰ درجه استاندارد ISIRI برای خطوط فاضلاب.',
      inStock: true, featured: false, categoryId: createdCategories['fittings'],
      images: JSON.stringify([]), specifications: JSON.stringify({ 'زاویه': '۹۰°', 'قطر': '۱۶۰mm', 'جنس': 'PVC' }),
    },
    {
      name: 'شیر کشویی PN16 DN 100',
      slug: 'gate-valve-pn16-dn100',
      shortDescription: 'شیر کشویی چدنی DN 100 PN 16 برای شبکه آب‌رسانی',
      description: 'شیر کشویی تمام ربر (Gate Valve) با فلنج‌های استاندارد EN 1074.',
      inStock: true, featured: true, categoryId: createdCategories['valves'],
      images: JSON.stringify([]), specifications: JSON.stringify({ 'فشار': 'PN16', 'قطر': 'DN100', 'نوع': 'کشویی', 'جنس': 'چدن داکتیل' }),
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  // ─── Blog posts ───────────────────────────────────────
  const posts = [
    {
      title: 'راهنمای کامل انتخاب لوله آب و فاضلاب مناسب',
      slug: 'guide-to-choosing-industrial-pipes',
      excerpt: 'تفاوت لوله پلیکا، پلی اتیلن و چدن در کاربردهای مختلف آبرسانی و فاضلاب را بدانید.',
      content: '<p>انتخاب لوله مناسب یکی از مهم‌ترین تصمیماتی است که در پروژه‌های آب و فاضلاب باید گرفته شود...</p>',
      coverImage: '/images/blog/pipe-guide.jpg', tags: JSON.stringify(['راهنما', 'PVC', 'پلی اتیلن']),
      published: true, featured: true, readTime: 6, authorId: admin.id,
    },
    {
      title: 'مقایسه لوله PVC و پلی اتیلن؛ کدام بهتر است؟',
      slug: 'welded-vs-seamless-pipes',
      excerpt: 'مزایا و معایب لوله‌های PVC و HDPE PE100 از نظر استحکام، قیمت و شرایط کاری.',
      content: '<p>لوله‌های PVC و پلی اتیلن هر دو در شبکه‌های آب و فاضلاب کاربرد گسترده دارند...</p>',
      coverImage: '/images/blog/pvc-vs-pe.jpg', tags: JSON.stringify(['مقایسه', 'PVC', 'PE']),
      published: true, featured: false, readTime: 7, authorId: admin.id,
    },
    {
      title: 'استانداردهای ایرانی لوله‌های آب و فاضلاب',
      slug: 'international-pipe-standards',
      excerpt: 'آشنایی با استانداردهای ISIRI 4467 برای PVC، ISO 4427 برای PE و EN 545 برای چدن داکتیل.',
      content: '<p>استانداردها نقش حیاتی در تضمین کیفیت و ایمنی شبکه‌های آب و فاضلاب دارند...</p>',
      coverImage: '/images/blog/standards.jpg', tags: JSON.stringify(['استاندارد', 'ISIRI', 'ISO']),
      published: true, featured: false, readTime: 8, authorId: admin.id,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }

  // ─── FAQs ─────────────────────────────────────────────
  const faqs = [
    { question: 'تفاوت لوله پلیکا سری ۱۰۰ و ۱۲۵ چیست؟', answer: 'سری ۱۲۵ ضخامت بیشتری دارد و برای فشار بالاتر مناسب است. سری ۱۰۰ برای شبکه فاضلاب جاذبی (gravity) کاربرد دارد.', order: 1 },
    { question: 'آیا لوله پلی اتیلن برای آب آشامیدنی مناسب است؟', answer: 'بله، لوله PE100 با رنگ آبی رنگ مخصوص آب آشامیدنی بوده و مطابق استاندارد بهداشتی تولید می‌شود.', order: 2 },
    { question: 'چه نوع لوله‌ای برای شبکه آب‌رسانی شهری مناسب است؟', answer: 'برای شبکه‌های تحت فشار معمولاً از لوله پلی اتیلن PE100 یا لوله چدن داکتیل استفاده می‌شود.', order: 3 },
    { question: 'حداقل مقدار سفارش چقدر است؟', answer: 'برای لوله حداقل یک شاخه، برای اتصالات حداقل ۵ عدد. برای پروژه‌های بزرگ شرایط خاص داریم.', order: 4 },
    { question: 'آیا امکان تحویل در کارگاه ساختمانی وجود دارد؟', answer: 'بله، با ماشین‌آلات اختصاصی امکان تحویل درب کارگاه در مشهد و حومه را داریم.', order: 5 },
    { question: 'گواهینامه کیفیت (Mill Certificate) ارائه می‌دهید؟', answer: 'بله، برای تمام محصولات گواهینامه کیفی کارخانه (Mill Test Certificate) قابل ارائه است.', order: 6 },
  ];

  for (const faq of faqs) {
    const existing = await prisma.fAQ.findFirst({ where: { question: faq.question } });
    if (existing) {
      await prisma.fAQ.update({ where: { id: existing.id }, data: faq });
    } else {
      await prisma.fAQ.create({ data: faq });
    }
  }

  // Remove duplicate questions (keeps oldest row per question)
  const allFaqs = await prisma.fAQ.findMany({ orderBy: { createdAt: 'asc' } });
  const seenQuestions = new Set<string>();
  const duplicateIds: string[] = [];
  for (const f of allFaqs) {
    const key = f.question.trim();
    if (seenQuestions.has(key)) duplicateIds.push(f.id);
    else seenQuestions.add(key);
  }
  if (duplicateIds.length > 0) {
    await prisma.fAQ.deleteMany({ where: { id: { in: duplicateIds } } });
    console.log(`   Removed ${duplicateIds.length} duplicate FAQ entries`);
  }

  // ─── Testimonials ─────────────────────────────────────
  const testimonials = [
    { name: 'مهندس طاهری', company: 'اداره آب و فاضلاب مشهد', position: 'مدیر بهره‌برداری', content: 'چندین سال است که لوله‌های پلی اتیلن و چدن داکتیل مورد نیاز شبکه را از قدیر لوله آنلاین مشهد تامین می‌کنیم. کیفیت و تحویل به موقع همیشه مطلوب بوده است.', rating: 5 },
    { name: 'مهندس کمالی', company: 'شرکت پیمانکاری سازه آب', position: 'مدیرعامل', content: 'برای پروژه‌های آبرسانی روستایی بهترین منبع تامین لوله پلیکا و اتصالات در مشهد هستند. مشاوره فنی عالی و قیمت رقابتی دارند.', rating: 5 },
    { name: 'حاج عبدالهی', company: 'ساختمان‌سازی عمران تهران', position: 'مدیر تدارکات', content: 'تامین لوله‌کشی چند پروژه ساختمانی از این مجموعه بسیار رضایت‌بخش بود. تنوع محصول بالا و تحویل سریع.', rating: 5 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }

  // ─── Projects ─────────────────────────────────────────
  const projects = [
    {
      title: 'شبکه آب‌رسانی شهری منطقه رضوی مشهد',
      slug: 'razavi-water-supply-network',
      description: 'تامین و نصب ۱۸ کیلومتر لوله پلی اتیلن PE100 قطر ۲۵۰ تا ۵۰۰ میلیمتر برای شبکه توزیع آب منطقه رضوی',
      location: 'مشهد مقدس', year: 2023, featured: true, published: true,
      images: JSON.stringify([]),
    },
    {
      title: 'خط فاضلاب صنعتی پتروشیمی مشهد',
      slug: 'mashhad-petrochemical-sewage',
      description: 'تامین لوله PVC و اتصالات برای خط فاضلاب صنعتی ۸ کیلومتری پتروشیمی',
      location: 'شهرک صنعتی توس', year: 2023, featured: true, published: true,
      images: JSON.stringify([]),
    },
    {
      title: 'شبکه جمع‌آوری فاضلاب شهرک الهیه',
      slug: 'elahieh-sewage-collection',
      description: 'اجرای شبکه فاضلاب ۱۲ کیلومتری شهرک الهیه با لوله PVC قطر ۱۶۰ تا ۳۱۵ میلیمتر',
      location: 'مشهد، شهرک الهیه', year: 2022, featured: false, published: true,
      images: JSON.stringify([]),
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  // ─── Site settings ────────────────────────────────────
  const settings = [
    { key: 'site_title',      value: 'قدیر لوله آنلاین ' },
    { key: 'site_description', value: 'تامین‌کننده انواع لوله آب و فاضلاب، پلیکا، پلی اتیلن، چدن، منهول و اتصالات' },
    { key: 'contact_phone',   value: '051-12345678' },
    { key: 'contact_mobile',  value: '0915-1234567' },
    { key: 'contact_email',   value: 'info@luleonline-mashhad.ir' },
    { key: 'contact_address', value: 'مشهد، خیابان امام رضا، پلاک ۱۲۳' },
    { key: 'theme_color',     value: 'amber' },
    { key: 'hero_title',      value: 'تامین کامل لوله آب و فاضلاب' },
    { key: 'hero_subtitle',   value: 'لوله پلیکا، پلی اتیلن، چدن داکتیل، منهول و اتصالات — مستقیم از کارخانه' },
  ];

  for (const s of settings) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: {}, create: { ...s, type: 'text' } });
  }

  console.log('✅ Database seeded successfully!');
  console.log('   Admin: admin@luleonline.ir / admin123456');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
