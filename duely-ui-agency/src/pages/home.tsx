import {
  agency_pages_Q,
  current_agency_Q,
  page_definition_by_name_Q,
  useQuery
} from '@duely/client';
import { ErrorScreen, LoadingScreen } from '@duely/react';
import { useMemo } from 'react';
import { pageBlockComponents } from '../components/PageBlockEditor';

export default function Home() {
  const { data: agency, loading: agencyLoading, error: agencyError } = useQuery(current_agency_Q);
  const {
    data: page_definition,
    loading: page_definitionLoading,
    error: page_definitionError
  } = useQuery(page_definition_by_name_Q, { name: 'Home' });
  const { data: pages, loading: pagesLoading, error: pagesError } = useQuery(
    agency_pages_Q,
    { agency_id: agency?.id!, page_definition_id: page_definition?.id! },
    { skip: !agency || !page_definition }
  );

  const loading = agencyLoading || page_definitionLoading || pagesLoading;
  const error = agencyError ?? page_definitionError ?? pagesError;

  const page = pages?.[0];
  const children = useMemo(() => page?.blocks.map((block) => {
    const definition = block.definition;
    const Component = block && pageBlockComponents[definition.name as keyof typeof pageBlockComponents];
    const props = JSON.parse(block.data);
    return <Component key={block.id} {...props} />
  }), [page]);

  if (loading) return <LoadingScreen />;
  if (error || !children) return <ErrorScreen />;

  return children;
}
