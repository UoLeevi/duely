import { useCallback, useEffect, useState } from 'react';

export function useFocus(targetRef: React.RefObject<HTMLElement>): {
  focused: boolean;
  focus: () => void;
} {
  const focus = useCallback(() => targetRef.current?.focus(), [targetRef]);
  const [state, setState] = useState({ focused: false, focus });

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    const focusIn = () =>
      setState({
        focused: true,
        focus
      });

    const focusOut = () =>
      window.setTimeout(
        () =>
          setState({
            focused: false,
            focus
          }),
        50
      );

    targetRef.current.addEventListener('focusin', focusIn);
    targetRef.current.addEventListener('focusout', focusOut);

    return () => {
      targetRef.current?.removeEventListener('focusin', focusIn);
      targetRef.current?.removeEventListener('focusout', focusOut);
    };
  }, [targetRef]);

  return state;
}
