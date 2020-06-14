import React, { createContext } from 'react';

export const DomainContext = createContext();

const DomainContextProvider = (props) => {
  let subdomain = null;

  if (process.env.NODE_ENV === 'production') {
    const names = window.location.hostname.split('.');
    
    if (names.length === 3)
      subdomain = names[0].toLowerCase();

  } else {
    const queryParams = new URLSearchParams(window.location.search);
    let name = queryParams.get('subdomain');

    if (name)
      subdomain = name.toLowerCase();
  }

  return (
    <DomainContext.Provider value={{ subdomain }}>
      { props.children }
    </DomainContext.Provider>
  );
}

export default DomainContextProvider;
