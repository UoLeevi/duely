import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'jotai';
import { ApolloProvider } from '@apollo/client';
import MessageContextProvider from 'contexts/MessageContext';
import ModalContextProvider from 'contexts/ModalContext';
import AuthManager from 'components/AuthManager';
import Pages from 'pages';
import { client } from 'apollo';

export default function App() {
  return (
    <Provider>
      <ApolloProvider client={client}>
        <Router>
          <MessageContextProvider>
            <ModalContextProvider>
              <Suspense fallback={null}>
                <AuthManager />
              </Suspense>
              <Pages />
            </ModalContextProvider>
          </MessageContextProvider>
        </Router>
      </ApolloProvider>
    </Provider>
  );
}
