import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';
import { ViewportContext } from '../contexts/ViewportContext';

export function useModal(renderContent, arg = { props: {}, options: {} }) {
  const { useModal } = useContext(ModalContext);
  return useModal(renderContent, arg);
}

export function useBreakpoints() {
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
