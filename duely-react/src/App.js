import React from 'react';
import { IconContext } from 'react-icons';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewportContextProvider from './contexts/ViewportContext';
import AuthContextProvider from './contexts/AuthContext';
import DomainContextProvider from './contexts/DomainContext';
import ModalContextProvider from './contexts/ModalContext';
import AnimationContextProvider from './contexts/AnimationContext';
import FormContextProvider from './contexts/FormContext';
import { RoutesRoot } from './routes';

const App = () => (
  <Router>
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <DomainContextProvider>
          <ViewportContextProvider>
            <IconContext.Provider value={{}}>
              <AnimationContextProvider>
                <ModalContextProvider>
                  <FormContextProvider>
                    <RoutesRoot/>
                  </FormContextProvider>
                </ModalContextProvider>
              </AnimationContextProvider>
            </IconContext.Provider>
          </ViewportContextProvider>
        </DomainContextProvider>
      </AuthContextProvider>
    </ApolloProvider>
  </Router>
);

export default App;
