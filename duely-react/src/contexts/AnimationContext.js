import React, { createContext, useRef, useCallback } from 'react';

export const AnimationContext = createContext();

const AnimationContextProvider = ({ children }) => {
  const animationsRef = useRef(new Map());
  const registerAnimationSource = useCallback(ref => {
    animationsRef.current.set(ref, null);
    return () => animationsRef.current.delete(ref);
  }, []);

  const setAnimationState = useCallback(({ ref, state, keyframes, options }) => {
    
  }, []);

  return (
    <AnimationContext.Provider value={{ registerAnimationSource, setAnimationState }}>
      { children }
    </AnimationContext.Provider>
  );
};

export function withAnimationContext(Fn) {
  return (
    <AnimationContextProvider>
      <Fn />
    </AnimationContextProvider>
  );
}

export default AnimationContextProvider;
