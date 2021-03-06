import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import MessageContextProvider from '~/contexts/MessageContext';
import ModalContextProvider from '~/contexts/ModalContext';
import DomainManager from '~/components/DomainManager';
import Pages from '~/pages';
import { ScreenOverlayContextProvider, ViewportContextProvider, AuthManager } from '@duely/react';
import { client } from '@duely/client';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <ViewportContextProvider>
          <ScreenOverlayContextProvider>
            <MessageContextProvider>
              <ModalContextProvider>
                <AuthManager>
                  <DomainManager>
                    <Pages />
                  </DomainManager>
                </AuthManager>
              </ModalContextProvider>
            </MessageContextProvider>
          </ScreenOverlayContextProvider>
        </ViewportContextProvider>
      </Router>
    </ApolloProvider>
  );
}
