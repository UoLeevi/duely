import { useRef } from 'react'
import useResizeObserver from 'hooks/useResizeObserver';

/** Binds element's x, y, width and height as other elements css custom properties
 * fromRef = ref to element which size and position should be tracked
 * toRef   = ref to element to which properties should be set
 */
const resizeObserverOptions = { box: 'border-box' };

export default function useCssRect(fromRef, toRef, prefix = '') {
  const ref = useRef({});

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

  const unobserve = useResizeObserver(fromRef, entry => {
    if (!toRef?.current) return;

    const rect = entry.target.getBoundingClientRect(); // entry.contentRect
    const { x, y, width: w, height: h } = rect;
    const style = toRef.current.style;
    style.setProperty(`--${prefix}x`, x);
    style.setProperty(`--${prefix}y`, y);
    style.setProperty(`--${prefix}w`, w);
    style.setProperty(`--${prefix}h`, h);
  }, resizeObserverOptions);

  ref.current = { fromRef, toRef, prefix, unobserve };
}
