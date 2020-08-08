import React from 'react';
import { IconContext } from 'react-icons';
import { ApolloProvider } from '@apollo/client';
import { client } from 'apollo';
import ViewportContextProvider from 'contexts/ViewportContext';
import MessageContextProvider from 'contexts/MessageContext';
import ModalContextProvider from 'contexts/ModalContext';
import AnimationContextProvider from 'contexts/AnimationContext';
import FormContextProvider from 'contexts/FormContext';
import AppStateContextProvider from 'contexts/AppStateContext';
import RouteContextProvider from 'contexts/RouteContext';
import RoutesRoot from 'components/RoutesRoot';

const App = () => (
  <ApolloProvider client={client}>
    <AppStateContextProvider>
      <RouteContextProvider>
        <ViewportContextProvider>
          <IconContext.Provider value={{}}>
            <AnimationContextProvider>
              <FormContextProvider>
                <MessageContextProvider>
                  <ModalContextProvider>
                    <RoutesRoot />
                  </ModalContextProvider>
                </MessageContextProvider>
              </FormContextProvider>
            </AnimationContextProvider>
          </IconContext.Provider>
        </ViewportContextProvider>
      </RouteContextProvider>
    </AppStateContextProvider>
  </ApolloProvider>
);

export default App;
