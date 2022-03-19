import { useRerender } from '@duely/react-form';
import { useCallback, useEffect, useState } from 'react';

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocus(
  targetRef: React.RefObject<HTMLElement | undefined>,
  options?: { trap?: boolean }
): {
  focused: boolean;
  focus: () => void;
} {
  const focus = useCallback(() => {
    const firstFocusable = targetRef.current?.matches(focusableSelector)
      ? targetRef.current
      : (targetRef.current?.querySelector(focusableSelector) as HTMLElement | null | undefined);

    firstFocusable?.focus();
  }, [targetRef]);

  const rerender = useRerender();
  const [state] = useState({ focused: false, focus, options });

  state.options = options;

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    const keyDown = (event: KeyboardEvent) => {
      const focused = targetRef.current?.matches(':focus-within') ?? false;
      if (focused === true) {
        if (state.options?.trap) {
          if (event.key === 'Tab') {
            const focusables = Array.from(
              targetRef.current?.querySelectorAll(focusableSelector) ?? []
            ) as HTMLElement[];

            if (event.shiftKey) {
              if (focusables.indexOf(document.activeElement as HTMLElement) === 0) {
                focusables[focusables.length - 1]?.focus();
                event.preventDefault();
              }
            } else {
              if (
                focusables.indexOf(document.activeElement as HTMLElement) ===
                focusables.length - 1
              ) {
                focusables[0]?.focus();
                event.preventDefault();
              }
            }
            return;
          }
        }

        state.focused = focused;
        rerender();
      }
    };

    const focusIn = (event: FocusEvent) => {
      const focused = targetRef.current?.matches(':focus-within') ?? false;
      if (focused !== state.focused) {
        if (!focused && state.options?.trap) {
          const element = event.target as HTMLElement;
          element.focus();
          return;
        }

        state.focused = focused;
        rerender();
      }
    };

    const focusOut = focusIn;

    targetRef.current.addEventListener('keydown', keyDown);
    targetRef.current.addEventListener('focusin', focusIn);
    targetRef.current.addEventListener('focusout', focusOut);

    return () => {
      targetRef.current?.removeEventListener('keydown', keyDown);
      targetRef.current?.removeEventListener('focusin', focusIn);
      targetRef.current?.removeEventListener('focusout', focusOut);
    };
  }, [targetRef]);

  return state;
}
