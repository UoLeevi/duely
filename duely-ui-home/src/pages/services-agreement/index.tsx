import React from 'react';
import { createClassName } from '@duely/util';
import { LoadingScreen, LoadingSpinner, PageLayout } from '@duely/react';
import { useQuery, markdown_Q } from '@duely/client';
import Markdown from 'markdown-to-jsx';

export type ServicesAgreementPageProps = {
  children: React.ReactNode;
  className?: string;
};

export function ServicesAgreementPage({ children, className }: ServicesAgreementPageProps) {
  const { data, loading, error } = useQuery(markdown_Q, {
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
      <div className={className}>
        <Markdown>{data?.data!}</Markdown>
      </div>
    </PageLayout>
  );
}
