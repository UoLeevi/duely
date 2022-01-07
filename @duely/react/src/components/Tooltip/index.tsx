import React, {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import { createClassName } from '@duely/util';
import { Transition } from '@headlessui/react';
import { useRerender } from '..';
import { usePrevious } from '../..';
import { ScreenOverlayContext } from '../../contexts';
import ReactDOM from 'react-dom';

export * from './TimeConversionTooltip';

export type TooltipProps = {
  children: React.ReactNode;
  className?: string;
  position?:
    | 'top left'
    | 'top center'
    | 'top right'
    | 'center left'
    | 'center'
    | 'center right'
    | 'bottom left'
    | 'bottom center'
    | 'bottom right';
} & (
  | { id: string; elementRef?: undefined }
  | { id?: undefined; elementRef: RefObject<HTMLElement> }
);

export function Tooltip({ children, className, id, elementRef, position }: TooltipProps) {
  position ??= 'top center';

  const rerender = useRerender();
  const [state] = useState<{ node: HTMLElement | null }>({ node: null });

  useLayoutEffect(() => {
    if (state.node !== null) return;
    if (!elementRef?.current?.matches(':focus-within')) return;
    state.node = elementRef.current;
    rerender();
  }, [state]);

  const focusin = useCallback(
    (e: Event) => {
      if (state.node !== null) return;
      state.node = e.currentTarget as HTMLElement;
      rerender();
    },
    [rerender]
  );
  const focusout = useCallback(
    (e: Event) => {
      if (state.node !== (e.currentTarget as HTMLElement)) return;
      state.node = null;
      rerender();
    },
    [rerender]
  );
  const mouseenter = useCallback(
    (e: Event) => {
      if (state.node !== null) return;
      state.node = e.currentTarget as HTMLElement;
      rerender();
    },
    [rerender]
  );
  const mouseleave = useCallback(
    (e: Event) => {
      if (state.node !== (e.currentTarget as HTMLElement)) return;
      if (state.node.matches(':focus-within')) return;
      state.node = null;
      rerender();
    },
    [rerender]
  );
  const click = useCallback(
    (e: Event) => {
      if (state.node !== null) return;
      state.node = e.currentTarget as HTMLElement;
      rerender();
    },
    [rerender]
  );
  const outsideClick = useCallback(
    (e: Event) => {
      if (state.node === null) return;
      const element = e.target as HTMLElement;
      if (state.node === element || state.node.contains(element)) return;
      state.node = null;
      rerender();
    },
    [rerender]
  );
  const scroll = useCallback(
    (e: Event) => {
      if (state.node === null) return;
      state.node = null;
      rerender();
    },
    [rerender]
  );

  useEffect(() => {
    if (!id && !elementRef) return;

    document.addEventListener('click', outsideClick);
    document.addEventListener('scroll', scroll);
    const nodes = id ? document.querySelectorAll(`[data-tooltip="${id}"]`) : [elementRef?.current!];
    nodes.forEach((node) => {
      node.addEventListener('click', click);
      node.addEventListener('focusin', focusin);
      node.addEventListener('focusout', focusout);
      node.addEventListener('mouseenter', mouseenter);
      node.addEventListener('mouseleave', mouseleave);
    });
    return () => {
      document.removeEventListener('click', outsideClick);
      document.removeEventListener('scroll', scroll);
      nodes.forEach((node) => {
        node.removeEventListener('click', click);
        node.removeEventListener('focusin', focusin);
        node.removeEventListener('focusout', focusout);
        node.removeEventListener('mouseenter', mouseenter);
        node.removeEventListener('mouseleave', mouseleave);
      });
    };
  }, [outsideClick, scroll, click, focusin, focusout, mouseenter, mouseleave, elementRef]);

  const { top, left } =
    usePrevious(state.node && getPositionRelativeToDocument(state.node, position), {
      skip: state.node === null
    }) ?? {};

  className = createClassName(
    'absolute rounded ring-1 ring-black/5 shadow-md z-50 bg-white text-sm',
    position?.includes('center') && '-translate-x-1/2 origin-center',
    position?.includes('bottom') && 'translate-y-1',
    position?.includes('top') && '-translate-y-[calc(100%+0.25rem)]',
    position?.includes('left') && 'mr-2',
    position?.includes('right') && 'ml-2',
    className
  );

  const screenOverlayRef = useContext(ScreenOverlayContext);
  if (!screenOverlayRef?.current) return null;

  return ReactDOM.createPortal(
    <Transition
      show={state.node !== null}
      id={id}
      className={className}
      style={{ top, left }}
      enter="transition ease-out duration-200"
      enterFrom="transform opacity-0 scale-90"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-100"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-90"
    >
      {children}
    </Transition>,
    screenOverlayRef.current
  );
}

function getPositionRelativeToDocument(
  element: HTMLElement,
  position?:
    | 'top left'
    | 'top center'
    | 'top right'
    | 'center left'
    | 'center'
    | 'center right'
    | 'bottom left'
    | 'bottom center'
    | 'bottom right'
) {
  const { top, left, width, height } = element.getBoundingClientRect();
  position ??= 'top left';

  switch (position) {
    case 'top left':
      return {
        left: left,
        top: top
      };

    case 'top center':
      return {
        left: left + width / 2,
        top: top
      };

    case 'top right':
      return {
        left: left + width,
        top: top
      };

    case 'center left':
      return {
        left: left,
        top: top + height / 2
      };

    case 'center':
      return {
        left: left + width / 2,
        top: top + height / 2
      };

    case 'center right':
      return {
        left: left + width,
        top: top + height / 2
      };

    case 'bottom left':
      return {
        left: left,
        top: top + height
      };

    case 'bottom center':
      return {
        left: left + width / 2,
        top: top + height
      };

    case 'bottom right':
      return {
        left: left + width,
        top: top + height
      };
  }
}
