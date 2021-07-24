import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import Pages from '~/pages';
import {
  ScreenOverlayContextProvider,
  ViewportContextProvider,
  MessageContextProvider,
  AuthManager
} from '@duely/react';
import { client } from '@duely/client';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <ViewportContextProvider>
          <ScreenOverlayContextProvider>
            <MessageContextProvider>
              <AuthManager />
              <Pages />
            </MessageContextProvider>
          </ScreenOverlayContextProvider>
        </ViewportContextProvider>
      </Router>
    </ApolloProvider>
  );
}
