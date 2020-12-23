import { useContext } from 'react';
import { ViewportContext } from '../contexts/ViewportContext';

const breakpoints = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536
};

export function useBreakpoints() : { [K in keyof typeof breakpoints]: boolean } {
  const { width } = useContext(ViewportContext);
  return Object.assign({}, ...Object.entries(breakpoints).map(([k, v]) => ({ [k]: v <= width })));
}
