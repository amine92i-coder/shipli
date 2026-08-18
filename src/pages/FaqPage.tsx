import { PageHeader } from '@/components/ui';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';
import { useT } from '@/i18n/LangContext';

export default function FaqPage() {
  const t = useT();
  return (
    <>
      <PageHeader eyebrow={t.faqPage.eyebrow} title={t.faqPage.title} intro={t.faqPage.intro} />
      <Faq />
      <Cta />
    </>
  );
}
