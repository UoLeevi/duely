import React, { createContext, ReactNode, useLayoutEffect, useRef, useState } from 'react';

export const ScreenOverlayContext = createContext<React.MutableRefObject<HTMLElement | null> | null>(
  null
);

type Props = {
  children: ReactNode;
};

export function ScreenOverlayContextProvider({ children }: Props) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (ready) return;
    setReady(true);
  }, [ready]);

  return (
    <ScreenOverlayContext.Provider value={ref}>
      <div
        className="fixed inset-0 z-30 grid w-full h-full bg-transparent pointer-events-none place-items-center"
        ref={ref}
      >
        {/* used as a portal container */}
      </div>
      {ready && children}
    </ScreenOverlayContext.Provider>
  );
}

export function withScreenOverlayContext(Fn: React.ComponentType) {
  return (
    <ScreenOverlayContextProvider>
      <Fn />
    </ScreenOverlayContextProvider>
  );
}
