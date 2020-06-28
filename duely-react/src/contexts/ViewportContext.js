import React, { createContext, useState, useEffect } from 'react';

export const ViewportContext = createContext();

const ViewportContextProvider = (props) => {

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
      { props.children }
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

export default ViewportContextProvider;
