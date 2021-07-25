import { useRef } from 'react';
import { useResizeObserver } from './useResizeObserver';

/** Binds element's x, y, width and height as other elements css custom properties
 * fromRef = ref to element which size and position should be tracked
 * toRef   = ref to element to which properties should be set
 */
const resizeObserverOptions: ResizeObserverOptions = { box: 'border-box' };

export function useCssRect(
  fromRef: React.RefObject<HTMLElement>,
  toRef: React.RefObject<HTMLElement>,
  prefix = ''
) {
  const ref = useRef<{
    fromRef?: React.RefObject<HTMLElement>;
    toRef?: React.RefObject<HTMLElement>;
    unobserve?: () => void;
    prefix?: string;
  }>({});

  if (ref.current.fromRef !== fromRef && ref.current.unobserve) {
    ref.current.unobserve();
  }

  if (ref.current.toRef !== toRef && ref.current.toRef?.current) {
    const style = ref.current.toRef.current.style;
    const prefix = ref.current.prefix;
    style.removeProperty(`--${prefix}x`);
    style.removeProperty(`--${prefix}y`);
    style.removeProperty(`--${prefix}w`);
    style.removeProperty(`--${prefix}h`);
  }

  const unobserve = useResizeObserver(
    fromRef,
    (entry) => {
      if (!toRef?.current) return;

      const rect = entry.target.getBoundingClientRect(); // entry.contentRect
      const { x, y, width: w, height: h } = rect;
      const style = toRef.current.style;
      style.setProperty(`--${prefix}x`, x.toFixed(5));
      style.setProperty(`--${prefix}y`, y.toFixed(5));
      style.setProperty(`--${prefix}w`, w.toFixed(5));
      style.setProperty(`--${prefix}h`, h.toFixed(5));
    },
    resizeObserverOptions
  );

  ref.current = { fromRef, toRef, prefix, unobserve };
}
