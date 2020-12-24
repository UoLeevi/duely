import { useEffect, useRef, useState } from 'react';
import { Util } from '@duely/react';
import { Image } from '@duely/core';

/**
 * Use image from file or if file is not provided use image from image object.
 */
export default function useImage({ file, image }: { file?: File | null; image?: Image | null }) {
  const initializedRef = useRef(false);

  const [state, setState] = useState<{
    name?: string | null;
    file?: File | null;
    loading: boolean;
    error: Error | null;
    data: string | null;
    url?: string | null;
    color?: string;
  }>({
    file,
    name: file?.name ?? image?.name,
    loading: !!file,
    error: null,
    data: file ? null : image?.data ?? null
  });

  useEffect(() => {
    if (file) return;
    if (!image?.data || image.data === state.data) return;
    setState({ file: null, loading: false, error: null, data: image?.data ?? null });
  }, [file, image?.data, state.data]);

  useEffect(() => {
    if (initializedRef.current && file === state.file) return;
    initializedRef.current = true;

    if (!file) {
      setState({ file, loading: false, error: null, data: image?.data ?? null });
      return;
    }

    Util.processImageFile(file)
      .then((image) => setState({ file, loading: false, error: null, ...image! }))
      .catch((error) => setState({ file, loading: false, error, data: null }));
  }, [file, image?.data, state.file]);

  return state;
}
