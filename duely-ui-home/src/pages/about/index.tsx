import React from 'react';
import { createClassName } from '@duely/util';
import Markdown from 'markdown-to-jsx';
import { LoadingScreen, PageLayout } from '@duely/react';
import { markdown_Q, useQuery } from '@duely/client';

export type AboutProps = {
  children: React.ReactNode;
  className?: string;
};

export function About({ children, className }: AboutProps) {
  const { data, loading, error } = useQuery(markdown_Q, {
    markdown_id: 'duely-files/about.md'
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
