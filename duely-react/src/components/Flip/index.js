import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import './Flip.css';

const Flip = React.forwardRef(({ children, placeItems = 'center', transitionKey, className, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  const element = React.Children.only(children);
  const [renderedElement, setRenderedElement] = useState(element);
  const fromRef = useRef();
  const transitionKeyRef = useRef(transitionKey);
  const shouldFlip = transitionKeyRef.current !== transitionKey
    || renderedElement.key !== element.key
    || renderedElement.type !== element.type;

  const resetRefs = () => {
    transitionKeyRef.current = transitionKey;
    fromRef.current = undefined;
  };

  useLayoutEffect(() => {
    if (fromRef.current) {
      let requestId;

      /**
       * https://www.youtube.com/watch?v=SXtFBXmwgLQ
       * 
       * FLIP
       * F = First
       * L = Last
       * I = Invert
       * P = Play
       */

      requestId = requestAnimationFrame(() => {
        const fromRect = fromRef.current;

        // Last
        const element = ref.current.firstElementChild;
        const toRect = element.getBoundingClientRect();

        // Invert
        const dx = toRect.x - fromRect.x;
        const dy = toRect.y - fromRect.y;
        const dw = toRect.width / fromRect.width;
        const dh = toRect.height / fromRect.height;

        // (so CSS knows it's being flipped)
        ref.current.dataset.flipping = true;

        element.style.setProperty("--dx", dx);
        element.style.setProperty("--dy", dy);
        element.style.setProperty("--dw", dw);
        element.style.setProperty("--dh", dh);

        // Play
        requestId = requestAnimationFrame(() => {
          resetRefs();
          delete ref.current.dataset.flipping;
        });
      });

      return () => cancelAnimationFrame(requestId);
    }
  }, [fromRef.current, ref.current, resetRefs]);

  useEffect(() => {
    if (shouldFlip) {
      // First
      fromRef.current = ref.current.firstElementChild.getBoundingClientRect();
      setRenderedElement(element);
    }
  }, [shouldFlip, element]);

  className = Array.from(new Set(((className ?? '') + ' flip grid').split(' '))).join(' ');

  return (
    <div className={ className } style={{ placeItems }} { ...props } ref={ ref }>
      { renderedElement }
    </div>
  );
});

export default Flip;
