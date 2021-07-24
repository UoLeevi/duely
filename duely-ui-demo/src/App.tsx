import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '@duely/client';
import {
  ViewportContextProvider,
  ScreenOverlayContextProvider,
  MessageContextProvider,
  AuthManager
} from '@duely/react';
import Workspace from './Workspace';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <ViewportContextProvider>
          <ScreenOverlayContextProvider>
            <MessageContextProvider>
              <AuthManager>
                <Workspace />
              </AuthManager>
            </MessageContextProvider>
          </ScreenOverlayContextProvider>
        </ViewportContextProvider>
      </Router>
    </ApolloProvider>
  );
}
