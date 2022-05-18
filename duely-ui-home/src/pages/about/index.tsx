import { createClassName } from '@duely/util';
import { LoadingScreen, PageLayout, useMarkdoc} from '@duely/react';

export type AboutProps = {
  className?: string;
};

export function About({ className }: AboutProps) {
  const { children, loading, error } = useMarkdoc({
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
      <div className={className}>{children}</div>
    </PageLayout>
  );
}
