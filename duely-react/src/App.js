import React from 'react';
import { IconContext } from 'react-icons';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewportContextProvider from './contexts/ViewportContext';
import AuthContextProvider from './contexts/AuthContext';
import DomainContextProvider from './contexts/DomainContext';
import ModalContextProvider from './contexts/ModalContext';
import { RoutesRoot } from './routes';

const App = () => (
  <Router>
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <DomainContextProvider>
          <ViewportContextProvider>
            <IconContext.Provider value={{}}>
              <ModalContextProvider>
                <RoutesRoot/>
              </ModalContextProvider>
            </IconContext.Provider>
          </ViewportContextProvider>
        </DomainContextProvider>
      </AuthContextProvider>
    </ApolloProvider>
  </Router>
);

export default App;
