import { useEffect, useState } from 'react';
import type { ImageInput } from '@duely/core';
import { Util } from '../util';

type ImageFromFileState = {
  image: ImageInput | null;
  loading: boolean;
  error: Error | null;
};

/**
 * Use image from file or if file is not provided use image from image object.
 */
export function useImageInputFromFileList(fileList: FileList | null | undefined): {
  image: ImageInput | null;
  loading: boolean;
  error: Error | null;
} {
  const [state, setState] = useState<ImageFromFileState>({
    image: null,
    loading: !!fileList,
    error: null
  });

  useEffect(() => {
    if (!fileList || fileList.length === 0) {
      setState({
        loading: false,
        error: null,
        image: null
      });
      return;
    }

    if (fileList.length !== 1) {
      setState({
        loading: false,
        error: new Error('Only one file should be provided.'),
        image: null
      });
      return;
    }

    const file = fileList[0];
    setState({
      loading: true,
      error: null,
      image: null
    });

    Util.readFileAsImageInput(file)
      .then((image) => setState({ loading: false, error: null, image }))
      .catch((error) => setState({ loading: false, error, image: null }));
  }, [fileList, fileList?.length]);

  return state;
}
