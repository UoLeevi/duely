import React, { createContext, useLayoutEffect, useRef, useState } from 'react';

export const ScreenOverlayContext = createContext();

export function ScreenOverlayContextProvider({ children }) {
  const ref = useRef();
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (ready) return;
    setReady(true);
  }, [ready])

  return (
    <ScreenOverlayContext.Provider value={ref}>
      <div className="fixed inset-0 grid w-full h-full z-20 place-items-center bg-transparent pointer-events-none" ref={ref}>
        {/* used as a portal container */}
      </div>
      {ready && children}
    </ScreenOverlayContext.Provider>
  );
}

export function withScreenOverlayContext(Fn) {
  return (
    <ScreenOverlayContextProvider>
      <Fn />
    </ScreenOverlayContextProvider>
  );
}
