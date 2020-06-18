import { useContext } from 'react';
import { ViewportContext } from '../contexts/ViewportContext';

export default function useBreakpoints() {
  const { width } = useContext(ViewportContext);
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  };

  for (let [k, v] of Object.entries(breakpoints)) {
    breakpoints[k] = v < width;
  }

  return breakpoints;
}
