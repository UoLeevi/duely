import React, { useRef, ReactNode } from 'react';
import { ApolloError } from '@apollo/client';
import { markdown_Q, useQuery } from '@duely/client';
import Markdoc from '@markdoc/markdoc';

export type useMarkdocOptions = {
  markdown_id: string;
};

export function useMarkdoc(options: useMarkdocOptions): {
  loading: boolean;
  error: ApolloError | undefined;
  children: ReactNode;
} {
  const ref = useRef<React.ReactNode>();
  const { data, loading, error } = useQuery(markdown_Q, {
    markdown_id: options.markdown_id
  });

  if (loading || error) {
    return {
      loading,
      error,
      children: null
    };
  }

  if (!ref.current) {
    const ast = Markdoc.parse(data?.data!);
    const content = Markdoc.transform(ast);
    ref.current = Markdoc.renderers.react(content, React);
  }

  return {
    children: ref.current,
    loading: false,
    error: undefined
  };
}
