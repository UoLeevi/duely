import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import ViewportContextProvider from './contexts/ViewportContext';
import AuthContextProvider from './contexts/AuthContext';
import DomainContextProvider from './contexts/DomainContext';
import ViewRoot from './ViewRoot';
import DomainSwitch from './DomainSwitch';

const App = () => (
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <DomainContextProvider>
        <ViewportContextProvider>
          <ViewRoot>
            <DomainSwitch/>
          </ViewRoot>
        </ViewportContextProvider>
      </DomainContextProvider>
    </AuthContextProvider>
  </ApolloProvider>
);

export default App;
