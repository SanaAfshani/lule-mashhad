import type { Metadata } from 'next';
import { ServicesContent } from './ServicesContent';

export const metadata: Metadata = {
  title: 'خدمات | قدیر لوله آنلاین',
  description: 'خدمات تخصصی قدیر لوله آنلاین: مشاوره فنی رایگان، برش و تبدیل لوله، ارائه Mill Certificate، گارانتی کیفیت و ارسال به سراسر ایران.',
};

export default function ServicesPage() {
  return <ServicesContent />;
}
