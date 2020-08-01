import React from 'react';
import { IconContext } from 'react-icons';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
// import { BrowserRouter as Router } from 'react-router-dom';
import ViewportContextProvider from './contexts/ViewportContext';
import DomainContextProvider from './contexts/DomainContext';
import MessageContextProvider from './contexts/MessageContext';
import ModalContextProvider from './contexts/ModalContext';
import AnimationContextProvider from './contexts/AnimationContext';
import FormContextProvider from './contexts/FormContext';
import AppStateContextProvider from './contexts/AppStateContext';
import RouteContextProvider from './contexts/RouteContext';
import { RoutesRoot } from './routes';

const App = () => (
  // <Router>
    <ApolloProvider client={client}>
      <AppStateContextProvider>
        <RouteContextProvider>
          <DomainContextProvider>
            <ViewportContextProvider>
              <IconContext.Provider value={{}}>
                <AnimationContextProvider>
                  <FormContextProvider>
                    <MessageContextProvider>
                      <ModalContextProvider>
                        <RoutesRoot/>
                      </ModalContextProvider>
                    </MessageContextProvider>
                  </FormContextProvider>
                </AnimationContextProvider>
              </IconContext.Provider>
            </ViewportContextProvider>
          </DomainContextProvider>
        </RouteContextProvider>
      </AppStateContextProvider>
    </ApolloProvider>
  // </Router>
);

export default App;
