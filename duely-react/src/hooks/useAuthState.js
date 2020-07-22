import useAppState from 'hooks/useAppState';

export default function useAuthState() {
  const [{ context: { authRef }},] = useAppState();
  const { state, send } = authRef;
  return [state, send];
}
