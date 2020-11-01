import { useEffect, useRef, useState } from 'react';
import { processImageFile } from 'utils';

export default function useImage(file) {
  const initializedRef = useRef(false);
  const [state, setState] = useState({ file, loading: !!file, error: null, data: null });
  useEffect(() => {
    if (initializedRef.current && file === state.file) return;
    initializedRef.current = true;

    if (!file) {
      setState({ file, loading: false, error: null, data: null });
      return;
    }

    processImageFile(file)
      .then(image => setState({ file, loading: false, error: null, ...image }))
      .catch(error => setState({ file, loading: false, error, data: null }));

  }, [file, state.file]);

  return state;
}
