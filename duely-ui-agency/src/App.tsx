import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import DomainManager from '~/components/DomainManager';
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
              <AuthManager>
                <DomainManager>
                  <Pages />
                </DomainManager>
              </AuthManager>
            </MessageContextProvider>
          </ScreenOverlayContextProvider>
        </ViewportContextProvider>
      </Router>
    </ApolloProvider>
  );
}
