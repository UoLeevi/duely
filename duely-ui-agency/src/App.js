import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import MessageContextProvider from 'contexts/MessageContext';
import ModalContextProvider from 'contexts/ModalContext';
import AuthManager from 'components/AuthManager';
import Pages from 'pages';
import { client } from '@duely/client';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <MessageContextProvider>
          <ModalContextProvider>
            <AuthManager />
            <Pages />
          </ModalContextProvider>
        </MessageContextProvider>
      </Router>
    </ApolloProvider>
  );
}
