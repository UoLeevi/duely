import { createClassName } from '@duely/util';
import { LoadingScreen, PageLayout, useMarkdoc } from '@duely/react';

export type ServicesAgreementPageProps = {
  className?: string;
};

export function ServicesAgreementPage({ className }: ServicesAgreementPageProps) {
  const { children, loading, error } = useMarkdoc({
    markdown_id: 'duely-files/legal/services-agreement.md'
  });

  if (loading)
    return (
      <PageLayout>
        <div className="grid place-items-center">
          <LoadingScreen />
        </div>
      </PageLayout>
    );

  className = createClassName(className, 'prose-sm prose prose-indigo');
  return (
    <PageLayout>
      <div className={className}>{children}</div>
    </PageLayout>
  );
}
