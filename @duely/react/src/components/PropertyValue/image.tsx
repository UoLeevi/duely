import { image_Q, useQuery } from '@duely/client';
import React from 'react';
import { useQueryState } from '../Query';
// import { useQuery, price_Q } from '@duely/client';

type Image = {
  id: string;
  name: string;
  color: string;
  data: string;
};

export type ImagePropertyValueProps = {
  children: string | Image | undefined | null;
  alt?: string;
};

export function ImagePropertyValue({ children, alt }: ImagePropertyValueProps) {
  // const ref = useRef<HTMLElement>(null);
  let { loading } = useQueryState();

  const image_id = typeof children === 'string' ? children : '';
  const skip = loading || !image_id;
  let image: Image | undefined | null;

  if (typeof children === 'object') {
    image = children;
  }

  const { data: imageObj, loading: queryLoading } = useQuery(image_Q, { image_id }, { skip });

  loading ||= queryLoading;

  if (loading) {
    return <div className="flex-shrink-0 w-32 h-20 bg-gray-200 rounded animate-pulse"></div>;
  }

  if (typeof image !== 'object') image = imageObj;

  // TODO: Remove this check
  if (image === null || typeof image !== 'object')
    return <div className="flex-shrink-0 w-32 h-20 bg-gray-200 rounded"></div>;

  return (
    <>
      <img className="flex-shrink-0 object-cover w-32 h-20 rounded" src={image.data} alt={alt} />
    </>
  );
}
