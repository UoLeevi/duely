import { RecoilRoot } from 'recoil';
import AuthManager from '@/components/AuthManager';

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <AuthManager>
        <Component { ...pageProps } />
      </AuthManager>
    </RecoilRoot>
  );
}
