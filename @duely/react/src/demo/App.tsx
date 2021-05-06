import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '@duely/client';
import { ScreenOverlayContextProvider, ViewportContextProvider } from '../contexts';
import Workspace from './Workspace';
import AuthManager from '../components/auth/AuthManager';

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
