import React, { createContext, useState, useEffect } from 'react';

export const ViewportContext = createContext();

export function ViewportContextProvider({ children }) {

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <ViewportContext.Provider value={{ width, height }}>
      { children }
    </ViewportContext.Provider>
  );
}

export function withViewportContext(Fn) {
  return (
    <ViewportContextProvider>
      <Fn />
    </ViewportContextProvider>
  );
}
