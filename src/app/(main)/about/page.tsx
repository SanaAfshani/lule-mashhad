import type { Metadata } from 'next';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
  title: 'درباره ما | قدیر لوله آنلاین',
  description: 'قدیر لوله آنلاین — با بیش از ۲۰ سال تجربه، تامین‌کننده انواع لوله پلیکا، پلی اتیلن، چدن داکتیل، منهول و شیرآلات صنعتی در مشهد و خراسان رضوی.',
};

export default function AboutPage() {
  return <AboutContent />;
}
