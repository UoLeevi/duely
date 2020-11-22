import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import MessageContextProvider from 'contexts/MessageContext';
import ModalContextProvider from 'contexts/ModalContext';
import AuthManager from 'components/AuthManager';
import Pages from 'pages';
import { ScreenOverlayContextProvider, ViewportContextProvider } from '@duely/react';
import { client } from '@duely/client';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <ViewportContextProvider>
          <ScreenOverlayContextProvider>
            <MessageContextProvider>
              <ModalContextProvider>
                <AuthManager />
                <Pages />
              </ModalContextProvider>
            </MessageContextProvider>
          </ScreenOverlayContextProvider>
        </ViewportContextProvider>
      </Router>
    </ApolloProvider>
  );
}
