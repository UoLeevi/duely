import React, { createContext, useRef, useEffect, useState } from 'react';
import { interpret } from 'xstate';
import { appMachine } from 'state';

export const MachineContext = createContext();

const MachineContextProvider = ({ children }) => {
  const serviceRef = useRef();
  const [state, setState] = useState();

  useEffect(() => {
    serviceRef.current = interpret(appMachine)
      .onTransition(state => { 
        setState([state, serviceRef.current?.send]);
        // console.log(state);
      })
      .start();
    return () => serviceRef.current.stop();
  }, []);

  return (
    <MachineContext.Provider value={ state }>
      { state && children }
    </MachineContext.Provider>
  );
}

export function withMachineContext(Fn) {
  return (
    <MachineContextProvider>
      <Fn />
    </MachineContextProvider>
  );
}

export default MachineContextProvider;
