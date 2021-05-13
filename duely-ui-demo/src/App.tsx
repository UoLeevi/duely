import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '@duely/client';
import { ViewportContextProvider, ScreenOverlayContextProvider, AuthManager } from '@duely/react';
import Workspace from './Workspace';
import React from 'react';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <ViewportContextProvider>
          <ScreenOverlayContextProvider>
            <AuthManager>
              <Workspace />
            </AuthManager>
          </ScreenOverlayContextProvider>
        </ViewportContextProvider>
      </Router>
    </ApolloProvider>
  );
}
