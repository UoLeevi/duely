import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'jotai';
import MessageContextProvider from 'contexts/MessageContext';
import ModalContextProvider from 'contexts/ModalContext';
import AuthManager from 'components/AuthManager';
import Pages from 'pages';

export default function App() {
  return (
    <Provider>
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
    </Provider>
  );
}
