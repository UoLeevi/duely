import { useLayoutEffect } from 'react';

export function useClassName(domElement, className) {
  useLayoutEffect(() => {
    const classNames = className.split(' ');
    const added = classNames.filter(c => !domElement.classList.contains(c));
    added.forEach(c => domElement.classList.add(c));
    return () => added.forEach(c => domElement.classList.remove(c));
  }, [domElement, className]);
}
