import React from 'react';
import { IconContext } from 'react-icons';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import ViewportContextProvider from './contexts/ViewportContext';
import AuthContextProvider from './contexts/AuthContext';
import DomainContextProvider from './contexts/DomainContext';
import ModalContextProvider from './contexts/ModalContext';
import ViewRoot from './ViewRoot';
import DomainSwitch from './DomainSwitch';

const App = () => (
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <DomainContextProvider>
        <ViewportContextProvider>
          <IconContext.Provider>
            <ViewRoot>
              <ModalContextProvider>
                <DomainSwitch/>
              </ModalContextProvider>
            </ViewRoot>
          </IconContext.Provider>
        </ViewportContextProvider>
      </DomainContextProvider>
    </AuthContextProvider>
  </ApolloProvider>
);

export default App;
