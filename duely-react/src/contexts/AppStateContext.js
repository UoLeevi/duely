import React, { createContext, useRef, useEffect, useState } from 'react';
import { createDefaultAppMachineService } from 'state';

export const AppStateContext = createContext();

const AppStateContextProvider = ({ children }) => {
  const serviceRef = useRef();
  const [state, setState] = useState();

  useEffect(() => {
    const [service, stopService] = createDefaultAppMachineService();
    serviceRef.current = service
      .onTransition(setState)
      .start();

    return stopService;
  }, []);

  return (
    <AppStateContext.Provider value={ [state, serviceRef.current?.send] }>
      { state && children }
    </AppStateContext.Provider>
  );
}

export function withAppStateContext(Fn) {
  return (
    <AppStateContextProvider>
      <Fn />
    </AppStateContextProvider>
  );
}

export default AppStateContextProvider;
