import React, { useRef, useLayoutEffect } from 'react';
import useResizeObserver from 'hooks/useResizeObserver';
import './Background.css';

const precision = 4;

const Background = ({ children, scale = 1.0, placeItems = 'start center', contain, className, ...props }) => {
  const ref = useRef();
  useResizeObserver(ref, (entry) => {
    const threshold = 0.01;
    const background = entry.target.children[0];
    const { width: contentWidth, height: contentHeight } = entry.contentRect;
    const { width: backgroundWidth, height: backgroundHeight } = background.getBoundingClientRect();
    const contentAspectRatio = contentWidth / contentHeight;
    const backgroundAspectRatio = backgroundWidth / backgroundHeight;
    const currentScale = parseFloat(background.style.transform.substring(6));
    const newScale = scale * (((contentAspectRatio > backgroundAspectRatio) ^ contain) 
      ? contentWidth * currentScale / backgroundWidth
      : contentHeight * currentScale / backgroundHeight);

    if (Math.abs(1 - (currentScale / newScale)) > threshold) {
      const s = (Math.ceil((newScale + Number.EPSILON) * 10 ** precision) / (10 ** precision) + Number.EPSILON).toFixed(precision);
      background.style.transform = `scale(${ s })`;
    }
  });

  useLayoutEffect(() => {
    const content = ref.current;
    const background = content.children[0];
    const { width: contentWidth, height: contentHeight } = content.getBoundingClientRect();
    const { width: backgroundWidth, height: backgroundHeight } = background.getBoundingClientRect();
    const contentAspectRatio = contentWidth / contentHeight;
    const backgroundAspectRatio = backgroundWidth / backgroundHeight;

    const newScale = scale * (((contentAspectRatio > backgroundAspectRatio) ^ contain) 
      ? contentWidth / backgroundWidth
      : contentHeight / backgroundHeight);

    const s = (Math.ceil((newScale + Number.EPSILON) * 10 ** precision) / (10 ** precision) + Number.EPSILON).toFixed(precision);
    background.style.transform = `scale(${ s })`;
  }, [scale, contain]);

  className = Array.from(new Set(((className ?? '') + ' background-component').split(' '))).join(' ');

  return (
    <div className={ className } style={{ placeItems }} { ...props } ref={ ref }>
      { children }
    </div>
  );
};

export default Background;
