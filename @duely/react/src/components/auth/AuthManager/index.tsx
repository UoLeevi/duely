import React from 'react';
import { useVerificationCode } from './useVerificationCode';
import { useAccessToken } from './useAccessToken';
import { useLogInOut } from './useLogInOut';
import { LoadingScreen } from '../../LoadingScreen';

type AuthManagerProps = {
  children?: React.ReactNode;
};

export default function AuthManager({ children }: AuthManagerProps) {
  const { loading: accessTokenLoading } = useAccessToken();
  const { loading: verificationLoading } = useVerificationCode();
  const { loading: logInOutLoading } = useLogInOut();

  const loading = accessTokenLoading || verificationLoading || logInOutLoading;

  if (loading) return <LoadingScreen />;

  return <React.Fragment>{children}</React.Fragment> ?? null;
}
