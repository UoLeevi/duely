import React, { createContext, useRef, useEffect } from 'react';

export const StyleSheetContext = createContext();

const StyleSheetContextProvider = ({ children, ...props }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = document.createElement('style');
    document.head.appendChild(ref.current);
    return () => ref.current.remove();
  }, []);

  function insertRule(rule) {
    return ref.current.sheet.insertRule(rule);
  }

  return (
    <StyleSheetContext.Provider value={{ insertRule }}>
      { children }
    </StyleSheetContext.Provider>
  );
}

export function withStyleSheetContext(Fn) {
  return (
    <StyleSheetContextProvider>
      <Fn />
    </StyleSheetContextProvider>
  );
}

export default StyleSheetContextProvider;
