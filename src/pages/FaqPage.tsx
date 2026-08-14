import { PageHeader } from '@/components/ui';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources · FAQ"
        title="Duties, timelines, minimums and payment protection"
        intro="The questions Moroccan importers ask us before the first order. If yours is missing, the contact desk answers the same working day."
      />
      <Faq />
      <Cta />
    </>
  );
}
