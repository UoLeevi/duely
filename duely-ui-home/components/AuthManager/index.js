import { useVerificationCode } from './useVerificationCode';
import { useAccessToken } from './useAccessToken';
import { useLogInOut } from './useLogInOut';

export default function AuthManager({ children }) {
  useAccessToken();
  useVerificationCode();
  useLogInOut();

  return children;
}
