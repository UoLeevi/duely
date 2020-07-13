import React, { createContext } from 'react';

export const DomainContext = createContext();

const DomainContextProvider = ({ children }) => {
  const domain = window.location.hostname.toLowerCase();
  let subdomain = null;

  if (process.env.NODE_ENV === 'production') {
    if (domain !== 'duely.app') {
      if (domain.endsWith('.duely.app')) {
        subdomain = domain.slice(0, -'.duely.app'.length);
      } else {
        // TODO: check from database
        throw new Error('Not implemented.');
      }
    }
  } else {
    const queryParams = new URLSearchParams(window.location.search);
    let name = queryParams.get('subdomain');

    if (name) {
      subdomain = name.toLowerCase();
    }
  }

  return (
    <DomainContext.Provider value={{ subdomain, domain }}>
      { children }
    </DomainContext.Provider>
  );
}

export default DomainContextProvider;
